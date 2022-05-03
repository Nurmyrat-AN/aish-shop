const JSZip = require("jszip")
const ab2str = require('arraybuffer-to-string')

const ArchiveUtils = {
    unzip: async (data) => {
        const res = {}
        const jsZip = new JSZip();
        const zip = await jsZip.loadAsync(data)
        for await (let filename of Object.keys(zip.files)) {
            const fileData = await zip.files[filename].async("arraybuffer")
            try {
                const json = ab2str(fileData, 'utf8')
                res[filename] = JSON.parse(json)
            } catch (e) {
                throw e
            }
        }
        return res
    },

    zip: async (data) => {
        var zip = new JSZip()
        zip.file('data', JSON.stringify(data))
        const content = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE"
        })
        return content
    }
}

export default ArchiveUtils