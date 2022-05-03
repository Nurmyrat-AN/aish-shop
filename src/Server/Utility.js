const AdmZip = require("adm-zip");
const JSZip = require("jszip")
const ab2str = require('arraybuffer-to-string')


class Utility {
    constructor(db) {
        this.db = db
    }

    queryAsync = (sql) => {
        return new Promise((resolve, reject) => this.db.query(sql, (error, results, fields) => error ? reject(error) : resolve(results)))
    }

    getRequestData = async (req) => {
        return (await (req.headers.device === 'mobile-app' ? this.unzipMobile(req.body.content) : this.unzip(req.files.file.data))).data
    }

    zip = async (datas) => {
        const zip = new AdmZip()
        Object.keys(datas || {}).forEach(data_name => {
            try {
                zip.addFile(data_name, Buffer.from(JSON.stringify(datas[data_name]), "utf8"), "");
            } catch (e) {
            }
        })
        // zip.writeZip('/ok.zip')
        return zip.toBuffer()
    }

    unzip = async (file) => {
        const zip = new AdmZip(file);
        const zipEntries = zip.getEntries(); // an array of ZipEntry records
        const result = {}
        zipEntries.forEach(function (zipEntry) {
            result[zipEntry.name] = JSON.parse(zipEntry.getData().toString("utf8"))
        })
        return result

    }

    unzipMobile = async (data) => {
        const jsZip = new JSZip();
        const zip = await jsZip.loadAsync(data.split(','))
        const result = {}
        for await (let filename of Object.keys(zip.files)) {
            const fileData = await zip.files[filename].async("arraybuffer")
            try {
                const json = ab2str(fileData, 'utf8')
                result[filename] = JSON.parse(json)
            } catch (e) {
                throw e
            }
        }
        return result
    }
}

module.exports = Utility