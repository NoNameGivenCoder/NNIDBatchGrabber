const fs = require('fs')
const path = require('path')
const https = require('https')

const axios = require('axios')

var nnids = JSON.parse(fs.readFileSync(__dirname + "/nnids.json").toString())

async function GetData() {
    for (let i = 0; i < nnids.length; i++) {
        //Getting data
        const nnid = nnids[i];
        const accountData = (await axios.get(`https://nnidlt.murilo.eu.org/api.php?env=production&user_id=${nnid}`))

        //Setting here for simplicity
        const path = `/data/${nnid}`

        console.log(`Creating directories at ${path}`)

        fs.mkdirSync(__dirname + path)
        fs.mkdirSync(__dirname + `${path}/images`)

        fs.writeFileSync(__dirname + `${path}/data.json`, Buffer.from(JSON.stringify(accountData.data, null, 4)))

        for (let i = 0; i < accountData.data.images.image.length; i++) {
            const image = accountData.data.images.image[i]

            //Getting correct format for all images, since one is TGA
            const format = image.url.split('.')

            const writer = fs.createWriteStream(__dirname + `${path}/images/${nnid}_${image.type}.${format[4]}`)

            //Having to set it to reject unauthorized, since without that, cdn files wont be able to be downloaded..
            const imageData = await axios({
                url: image.url,
                method: "GET",
                responseType: "stream",
                httpsAgent: new https.Agent({
                    rejectUnauthorized : false
                })
            })

            imageData.data.pipe(writer)

            console.log(`Got image for ${nnid}'s ${image.type} expression`)
        }
    }
}

GetData()
