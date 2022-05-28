const { v4: uuidv4 } = require('uuid')
const express = require('express')
const fileUpload = require('express-fileupload')
const http = require('http')
const cors = require('cors')
const { corsOptions, port } = require('./Constants')
const Utility = require('./Utility')
const app = express()
const db = require('./db')
const MAPPED_GET = require('./MAPPED_GET')
const MAPPED_GET_LIST = require('./MAPPED_GET_LIST')
const MAPPED_INSERT = require('./MAPPED_INSERT')
const MAPPED_UPDATE = require('./MAPPED_UPDATE')
const { SEPERATOR, STRINGIFYER, RecursivelyCheckImages } = require('./COMMON_FUNCTIONS')
const MAPPED_DELETE = require('./MAPPED_DELETE')
const MAPPED_TRUNCATE = require('./MAPPED_TRUNCATE')

const UTILS = new Utility(db)


app.use(cors(corsOptions))
app.use(express.json())
app.use(fileUpload())




app.get('/', (req, res) => {
    res.send(`Server running on port ${port}`)
})

app.post(['/:action/:data', '/:action/:data/:id'], async (req, res) => {
    try {
        let params = await UTILS.getRequestData(req)
        const { action, data } = req.params
        if (action === 'insert' || action === 'update') params = await RecursivelyCheckImages(params)
        const mapProps = { UTILS, params, SEPERATOR, STRINGIFYER, id: req.params.id }
        const routes = {
            get: { ...(new MAPPED_GET(mapProps)).mapped_data },
            list: { ...(new MAPPED_GET_LIST(mapProps)).mapped_data },
            insert: { ...(new MAPPED_INSERT(mapProps)).mapped_data },
            update: { ...(new MAPPED_UPDATE(mapProps)).mapped_data },
            delete: { ...(new MAPPED_DELETE(mapProps)).mapped_data },
            truncate: { ...(new MAPPED_TRUNCATE(mapProps)).mapped_data }
        }
        if (routes[action] && routes[action][data]) {
            res.send(req.headers.device === 'mobile-app' ? await routes[action][data]() : await UTILS.zip(await routes[action][data]()))
        } else {
            res.status(404).send('NOT FOUND')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('Something went wrong')
    }
})

app.get('/test', async (req, res) => res.send(await UTILS.zip({})))

app.post('/aish-shop/import/aish-datas/:shop', async (req, res) => {
    try {
        const DATA_KEYS = ['id', 'code', 'name', 'measure', 'price_base_for_sale', 'currency', 'isactive', 'property_1', 'property_2', 'property_3', 'property_4', 'property_5']

        const GET_INSERT_KEYS = DATA_KEYS.reduce((res, key) => `${res}${res ? ',' : ''}${key}`, 'shop')
        const GET_INSERT_VALUES = data => DATA_KEYS.reduce((res, key) => `${res}${res ? ',' : ''}${typeof data[key] === 'object' ? db.escape(JSON.stringify(data[key])) : typeof data[key] === 'string' ? db.escape(data[key]) : data[key]}`, `'${req.params.shop}'`)
        const GET_UPDATE_KEY_VALUES = data => DATA_KEYS.reduce((res, key) => `${res}${res ? ',' : ''}${key}=${typeof data[key] === 'object' ? db.escape(JSON.stringify(data[key])) : typeof data[key] === 'string' ? db.escape(data[key]) : data[key]}`, `shop='${req.params.shop}'`)

        await Promise.all(req.body.map(data => {
            data.id = `${req.params.shop}-${data.id}`
            return UTILS.queryAsync(`INSERT INTO datas(${GET_INSERT_KEYS})VALUES(${GET_INSERT_VALUES(data)}) ON DUPLICATE KEY UPDATE ${GET_UPDATE_KEY_VALUES(data)}`)
        }))

        res.send('OK')
    } catch (e) {
        console.log(e)
        res.status(500).send('Something went wrong')
    }

})

app.post('/mobile/register/account/client', async (req, res) => {
    try {
        const { phone } = await UTILS.getRequestData(req)
        res.send(await UTILS.zip({ code: '1234' }))
    } catch (e) {
        console.log(e)
        res.status(500).send('Something went wrong')
    }
})

const server = http.createServer(app)

server.listen(port, function () {
    console.log(`Node app is running on port ${port}`)
})

server.on('uncaughtException', function (err) {
    console.log('something terrible happened..', err)
})