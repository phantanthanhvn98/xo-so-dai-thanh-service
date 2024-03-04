import axios from "axios"
import  jsdom from "jsdom";

import { mienByTinh } from "../utils/data/contants.js";
import db from "../database/connect.js";
import { parseDate } from "../utils/utils.js";

const { JSDOM } = jsdom;

const giai = [
  {
    name: "Giải tám",
    key: "giai8"
  },
  {
    name: "Giải bảy",
    key: "giai7"
  },
  {
    name: "Giải sáu",
    key: "giai6"
  },
  {
    name: "Giải năm",
    key: "giai5"
  },
  {
    name: "Giải tư",
    key: "giai4"
  },
  {
    name: "Giải ba",
    key: "giai3"
  },
  {
    name: "Giải nhì",
    key: "giai2"
  },
  {
    name: "Giải nhất",
    key: "giai1"
  },
  {
    name: "Giải đặc biệt",
    key: "giaidb"
  }
]

const getResult = (url) => {
  let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      //   url: `https://www.xoso.net/getkqxs/${province}/${date}.js`,
      headers: { 
          'Cookie': 'mobile=desktop'
      }
  };
  
  return axios.request(config)
}

const parseResult = (htmlString) => {
    const dom = new JSDOM(htmlString.split(`$("#box_kqxs_minhngoc").append('`)[2].split(`');`)[0])
    return giai.map((item, index) => {
      return {
        key: item.name,
        value: dom.window.document.getElementsByClassName(item.key)[0]?.innerHTML.replaceAll("\t", "").split(" - ")
      }
    }).reduce(
      (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
}

const getResultProvice = async (province, date) => {
    return getResult(`https://www.xoso.net/getkqxs/${province}/${date}.js`)  
}


export async function  getResultProvices(provinces, date){
  const createdAt = parseDate(date)
  let kqs =  await  provinces.map(async (item) => {
    return {
      data: await getResultProvice(item.uri, date),
      Vung: mienByTinh[item.ten].Vung,
      Tinh: item.ten
    }
  })
  kqs = await Promise.all(kqs)
  kqs = kqs.map((item) => {
    return {
        Ngay: date,
        Tinh: item.Tinh,
        Vung: item.Vung,
        KetQua: parseResult(item.data.data),
        createdAt: createdAt
    }
  })
  insertMany(kqs)
  return kqs
}

async function insertMany(data){
  try {
      const collection = db.collection('ketquaxoso');
      const result = await collection.insertMany(data);
      console.log(`${result.insertedCount} documents inserted`);
    } finally {
    }

}