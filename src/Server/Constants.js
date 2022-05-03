const port = process.env.PORT || 2022
const whitelist = [
    'http://localhost:3000',
    'https://atom.com.tm',
    'https://atomtp.atom.com.tm',
    'https://cpanel.atom.com.tm',
    'https://atom20.com'
]; //white list consumers
const origin = (origin, callback) => {
    // console.log(origin)
    callback(null, whitelist.indexOf(origin) !== -1)
    return whitelist.indexOf(origin) !== -1
}

const corsOptions = {
    origin,
    methods: ['POST', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
        'device'
    ],
    header: {
        'Content-Type': 'application/json, application/zip, text/plain'
    }
}

module.exports = {
    port,
    origin,
    corsOptions
}