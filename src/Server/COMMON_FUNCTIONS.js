const { v4: uuidv4 } = require('uuid')

const url_IMAGE = 'http://192.168.20.118/atom'
// const root = '/var/www/atom/uploads/'
const root = 'C:/AppServ/www/atom/uploads/'

const isObject = data => typeof data === 'object' && data !== null && data !== undefined

const SEPERATOR = data => {
    try {
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') {
                try {
                    data[key] = JSON.parse(data[key])
                } catch (e) {
                }
            } else if (isObject(data[key])) data[key] = SEPERATOR(data[key])
        })
        return ADD_IMAGE_HOST(data)
    } catch (e) {
        return ADD_IMAGE_HOST(data)
    }
}

const ADD_IMAGE_HOST = data => {
    if (root === '/var/www/atom/uploads/') return data
    Object.keys(data || {}).forEach(key => {
        if (isObject(data[key])) {
            data[key] = ADD_IMAGE_HOST(data[key])
        } else if (typeof data[key] === 'string' && data[key].includes('/uploads/images/')) data[key] = `${url_IMAGE}${data[key]}`
    })
    return data
}

const REMOVE_IMAGE_HOST = data => {
    if (root === '/var/www/atom/uploads/') return data
    Object.keys(data).forEach(key => {
        if (isObject(data[key])) {
            data[key] = REMOVE_IMAGE_HOST(data[key])
        } else if (typeof data[key] === 'string' && data[key].includes(url_IMAGE)) data[key] = data[key].slice(url_IMAGE.length)
    })
    return data
}

const STRINGIFYER = dataReceive => {
    const data = REMOVE_IMAGE_HOST(dataReceive)
    try {
        Object.keys(data).forEach(key => {
            if (isObject(data[key])) {
                try {
                    data[key] = JSON.stringify(data[key])
                } catch (e) { }
            }
        })
        return data
    } catch (e) {
        return data
    }
}

const RecursivelyCheckImages = async (data) => {
    const newData = data
    await Promise.all(Object.keys(newData).map(key => new Promise(async (resolve, reject) => {
        if (isObject(data[key])) {
            newData[key] = await RecursivelyCheckImages(newData[key])
        } else if (typeof newData[key] === 'string' && newData[key].includes('data:image/')) {
            newData[key] = await SAVE_IMAGE_FILE(newData[key])
        }
        resolve()
    })))

    return newData
}


const SAVE_IMAGE_FILE = async (imgData) => {
    try {
        var base64Data = imgData.split(",")[1];
        const ext = base64FileHeaderMapper(base64Data)
        if (!ext) imgData

        const path = `${root}images/`
        const name = `${uuidv4()}.${ext}`
        const res = await new Promise((resolve, reject) => require("fs").writeFile(`${path}${name}`, base64Data, 'base64',
            function (err, data) {
                if (err) {
                    reject(err)
                }
                resolve(`/uploads/images/${name}`)
            }))
        return res
    } catch (e) {
        console.log(e)
        return imgData
    }
}

function base64FileHeaderMapper(fileBase64) {

    let fileHeader = new Map();

    //get the first 3 char of base64
    fileHeader.set("/9j", "JPG")
    fileHeader.set("iVB", "PNG")
    fileHeader.set("Qk0", "BMP")
    fileHeader.set("SUk", "TIFF")
    fileHeader.set("JVB", "PDF")
    fileHeader.set("UEs", "OFD")

    let res = ""

    fileHeader.forEach((v, k) => {
        if (k === fileBase64.substr(0, 3)) {
            res = v
        }
    })

    //if file is not supported
    if (res === "") {
        res = null
    }

    //return map value
    return res;
}

module.exports = { SEPERATOR, STRINGIFYER, RecursivelyCheckImages }