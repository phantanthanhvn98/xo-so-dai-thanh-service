import express from 'express'
import cors from 'cors'
import { format } from 'date-fns';
import {da, vi} from 'date-fns/locale'
import db from './database/connect.js';
import getPreviousTwoDays from "./utils/utils.js"


const app = express();
const port = 8764
app.use(express.json());
app.use(cors())

const kqxs = db.collection('ketquaxoso')

////////////////// GETTER ////////////////////////
app.get('/ketquaxoso/:ngay', async (req, res) => {
    let day = req.params.ngay
    const query = { Ngay: day };
    const result = (await kqxs.find(query).toArray()).reduce((result, obj) => {
        const groupField = obj.Vung;
        if (!result[groupField]) {
          result[groupField] = [];
        }
        result[groupField].push(obj);
        return result;
      }, {});;

    res.json(result);
});

app.get('/ketquaxoso/:vung/:ngay', async (req, res) => {
    let day = req.params.ngay
    const vung = req.params.vung
    if(day === "latest")
        day = format(new Date(), 'dd-MM-yyyy', { locale: vi});
    const query = { Ngay: {$in: [day, ...getPreviousTwoDays(day)]}, Vung: vung};
    const result = (await kqxs.find(query).toArray()).reduce((result, obj) => {
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