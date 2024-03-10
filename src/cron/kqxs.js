import axios from 'axios'

export function cloneMienNam (){
    const axios = require('axios');

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www.kqxs.vn/realtime/mien-nam.html',
        headers: { }
    };

    axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
    console.log(error);
    });
}