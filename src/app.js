import express from 'express'
import cors from 'cors'
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale'
import db from './database/connect.js';
import { getPreviousTwoDays, parseDayofWeek, parseDate, getTinhByDay } from "./utils/utils.js"
import { getResultProvices } from "./external/result.js"
import { calendar } from './utils/data/contants.js';

const DAYSTART = "10-03-2024"

const app = express();
const port = 8764
app.use(express.json());
app.use(cors())

const kqxs = db.collection('ketquaxoso')

////////////////// GETTER ////////////////////////
app.get('/ketquaxoso/:ngay', async (req, res) => {
    let day = req.params.ngay
    const query = { Ngay: day };
    let result = (await kqxs.find(query).toArray())
    const tinhResult = result.map((item) => item.Tinh)
    const parsedDay = parseDate(day)
    const dayOfWeek = parseDayofWeek(format(parsedDay, 'EEEE', { locale: enUS}))
    const  tinhDate = getTinhByDay(dayOfWeek)
    const addedTinh = tinhDate.filter(item => !tinhResult.includes(item.ten))
    if (addedTinh.length > 0 && new Date() - parseDate > 3600000){
        const addedTinhResult = await getResultProvices(addedTinh, day)
        result = result.concat(addedTinhResult)
    }
    result = result.reduce((result, obj) => {
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
    const parsedDay = parseDate(day)
    const dayOfWeek = parseDayofWeek(format(parsedDay, 'EEEE', { locale: enUS}))
    const tinhDate = calendar[dayOfWeek][vung].tinh
    if(day === "latest")
        day = format(new Date(), 'dd-MM-yyyy', { locale: vi});
    const query = { Ngay: {$in: [day, ...getPreviousTwoDays(day)]}, Vung: vung};
    let result = (await kqxs.find(query).toArray())
    const tinhResult = result.map((item) => item.Tinh)
    const addedTinh = tinhDate.filter(item => !tinhResult.includes(item.ten))
    if (addedTinh.length > 0 && new Date() - parseDate > 3600000){
        const addedTinhResult = await getResultProvices(addedTinh, day)
        result = result.concat(addedTinhResult)
    }
    result = result.reduce((result, obj) => {
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
    const exist = kqxs.findOne({Ngay: day, Tinh: tinh})
    // dieu kien ngay
    if(!exist){
        const addedTinhResult = await getResultProvices(addedTinh, day)
        result = result.concat(addedTinhResult)
    }
    let result
    if(day === "latest"){
        day = format(new Date(), 'dd-MM-yyyy', { locale: vi});
        result = await kqxs.find({Tinh: tinh}).sort({ createdAt: "desc" }).limit(3).toArray()
    }else{
        const query = { Ngay: {$in: [day, ...getPreviousTwoDays(day)]}, Tinh: tinh};
        result = await kqxs.find(query).toArray()
    }
    res.json(result.reduce((result, obj) => {
        const groupField = obj.Ngay;
    
        if (!result[groupField]) {
        result[groupField] = [];
        }
    
        result[groupField].push(obj);
    
        return result;
    }, {}))
});


////////////////// SETTER //////////////////////////
app.post('/ketquaxoso', async( req, res) => {
    const data = req.body
    await kqxs.updateOne({Tinh: data.Tinh, Ngay: data.Ngay}, {$set: data}, {upsert: true})
    res.json(data)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});