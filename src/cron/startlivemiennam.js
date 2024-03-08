import { format } from 'date-fns'
import { enUS, vi } from 'date-fns/locale'
import  db from "../database/connect.js"
import { templatkqxsmienbac, templatkqxsmiennam } from "../constants/template.js";
import { calendar } from "../constants/calendar.js";
import { parseDayofWeek, formatDateToDDMMYYYY, getDayOfWeekVN } from "../utils/utils.js";

const kqxs = db.collection('ketquaxoso')

export const startLiveMienNam = async () => {
    const today = new Date();
    const formattedDate = formatDateToDDMMYYYY(today)
    const existed = await kqxs.find({Ngay: formattedDate, Vung: "Miền Nam"}).toArray()
    if(existed.length < 1){
        const dayOfWeek = format(today, 'EEEE', { locale: enUS})
        const dataRule = calendar[parseDayofWeek(dayOfWeek)]
        const data = dataRule.nam.tinh.map((item) => {
            const template = JSON.parse(JSON.stringify(templatkqxsmiennam));
            template["Tinh"] = item.ten
            template["Vung"] = dataRule.nam.vi
            template["Thu"] = getDayOfWeekVN(today)
            template["Ngay"] = formatDateToDDMMYYYY(today)
            return template
        })
        await kqxs.insertMany(data)
    }
}

export const startLiveMienTrung = async () => {
    const today = new Date();
    const formattedDate = formatDateToDDMMYYYY(today)
    const existed = await kqxs.find({Ngay: formattedDate, Vung: "Miền Trung"}).toArray()
    if(existed.length < 1){
        const dayOfWeek = format(today, 'EEEE', { locale: enUS})
        const dataRule = calendar[parseDayofWeek(dayOfWeek)]
        const data = dataRule.trung.tinh.map((item) => {
            const template = JSON.parse(JSON.stringify(templatkqxsmiennam));
            template["Tinh"] = item.ten
            template["Vung"] = dataRule.trung.vi
            template["Thu"] = getDayOfWeekVN(today)
            template["Ngay"] = formatDateToDDMMYYYY(today)
            return template
        })
        await kqxs.insertMany(data)
    }
}

export const startLiveMienBac = async () => {
    const today = new Date();
    const formattedDate = formatDateToDDMMYYYY(today)
    const existed = await kqxs.find({Ngay: formattedDate, Vung: "Miền Bắc"}).toArray()
    if(existed.length < 1){
        const dayOfWeek = format(today, 'EEEE', { locale: enUS})
        const dataRule = calendar[parseDayofWeek(dayOfWeek)]
        const data = dataRule.bac.tinh.map((item) => {
            const template = JSON.parse(JSON.stringify(templatkqxsmienbac));
            template["Tinh"] = item.ten
            template["Vung"] = dataRule.bac.vi
            template["Thu"] = getDayOfWeekVN(today)
            template["Ngay"] = formatDateToDDMMYYYY(today)
            return template
        })
        await kqxs.insertMany(data)
    }
}