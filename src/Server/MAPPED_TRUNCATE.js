class MAPPED_TRUNCATE {
    constructor({ UTILS, params, SEPERATOR, STRINGIFYER, id }) {
        this.UTILS = UTILS
        this.params = params
        this.SEPERATOR = SEPERATOR
        this.STRINGIFYER = STRINGIFYER
        this.id = id
    }

    deleteData = async (table) => {
        await this.UTILS.queryAsync(`TRUNCATE TABLE ${table}`)
        return { result: { status: 'OK', message: 'Saved Successfully' } }
    }

    mapped_data = {
        productDatas: () => this.deleteData('datas'),
    }
}

module.exports = MAPPED_TRUNCATE