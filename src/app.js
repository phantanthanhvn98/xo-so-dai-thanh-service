import express from 'express'
import cors from 'cors'
import { format } from 'date-fns';
import {vi} from 'date-fns/locale/vi'
import db from './database/connect.js';
import { getPreviousNDays, parseDateFromDDMMYYYY} from "./utils/utils.js"
import cron  from "node-cron"
import { startLiveMienNam, startLiveMienTrung, startLiveMienBac } from "./cron/startlivemiennam.js"
import { isMienBacLive, isMienNamLive, isMienTrungLive } from './utils/schedule.js';


const app = express();
const port = 8764
app.use(express.json());
app.use(cors())

const kqxs = db.collection('ketquaxoso')
const users = db.collection('users')

////////////////// GETTER ////////////////////////
app.get('/ketquaxoso/:ngay', async (req, res) => {
    let day = req.params.ngay
    let dayNam, dayTrung, dayBac
    if(day === "latest"){
        day = format(new Date(), 'dd-MM-yyyy', { locale: vi});
        dayNam = isMienNamLive() ? day: getPreviousNDays(day, 1)[0]
        dayTrung = isMienTrungLive() ? day : getPreviousNDays(day, 1)[0]
        dayBac = isMienBacLive() ? day: getPreviousNDays(day, 1)[0]
    }
    console.log(dayNam, dayTrung, dayBac)
    const query = {$or: [{
        Ngay: dayNam,
        Vung: "Miền Nam"
        },
        {
            Ngay: dayTrung,
            Vung: "Miền Trung"
        },
        {
            Ngay: dayBac,
            Vung: "Miền Bắc"
        }
    ]};
    const result = (await kqxs.find(query, {projection:{_id:0}}).toArray()).reduce((result, obj) => {
        const groupField = obj.Vung;
        if (!result[groupField]) {
          result[groupField] = [];
        }
        result[groupField].push(obj);
        return result;
      }, {});
    res.json(result);
});

app.get('/ketquaxoso/:vung/:ngay', async (req, res) => {
    let day = req.params.ngay
    const vung = req.params.vung
    const page = parseInt(req.query.page)
    if(day === "latest"){
        day = format(new Date(), 'dd-MM-yyyy', { locale: vi});
    }
    const query = { Ngay: {$in: [day, ...getPreviousNDays(day, page)]}, Vung: vung};
    const result = (await kqxs.find(query, {projection:{_id:0}}).sort({createdAt: "desc"}).toArray()).reduce((result, obj) => {
        const groupField = obj.Ngay;
        if (!result[groupField]) {
          result[groupField] = [];
        }
        result[groupField].push(obj);
        return result;
      }, {});;
    res.json(result);
});

app.get('/ketquaxoso/:vung/:tinh/:ngay', async (req, res) => {
    let day = req.params.ngay
    const tinh = req.params.tinh
    const page = parseInt(req.query.page)
    let result
    if(day === "latest")
        day = format(new Date(), 'dd-MM-yyyy', { locale: vi});
    const query = { Ngay: {$in: [day, ...getPreviousNDays(day, page)]}, Tinh: tinh};
    result = await kqxs.find(query, {projection:{_id:0}}).toArray()
    res.json(result);
});

////////////////// SETTER //////////////////////////
app.post('/ketquaxoso', async( req, res) => {
    if(req.headers.username !== "admin" && req.headers.password !== 'admin@123qwe@Searchdrive30##')
        res.status(401).json()
    const data = req.body
    data.map((item) =>{
        item.createdAt = parseDateFromDDMMYYYY(item.Ngay)
        kqxs.updateOne({Tinh: item.Tinh, Ngay: item.Ngay}, {$set: item}, {upsert: true}).then((item2) =>{
            console.log(`insert oke: ${item.Ngay} ${item.Tinh}`)
        })
    })
    res.status(200).json(data)
})

//////////////// SECURITY //////////////////////////

app.post('/login', async (req, res) => {
    const data = await users.findOne({username: req.body.username, password: req.body.password})
    res.json(data) 
})


//////////////// CRON JOB //////////////////////////
const scheduleTimeMienNam = '0 16 * * *';
cron.schedule(scheduleTimeMienNam, startLiveMienNam);

const scheduleTimeMienTrung = '0 17 * * *';
cron.schedule(scheduleTimeMienTrung, startLiveMienTrung);

const scheduleTimeMienBac = '0 18 * * *';
cron.schedule(scheduleTimeMienBac, startLiveMienBac);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});