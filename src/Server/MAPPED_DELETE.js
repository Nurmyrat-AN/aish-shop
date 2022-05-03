class MAPPED_DELETE {
    constructor({ UTILS, params, SEPERATOR, STRINGIFYER, id }) {
        this.UTILS = UTILS
        this.params = params
        this.SEPERATOR = SEPERATOR
        this.STRINGIFYER = STRINGIFYER
        this.id = id
    }

    deleteData = async (table) => {
        this.UTILS.queryAsync(`DELETE FROM ${table} WHERE id='${this.id}'`)
        return { result: { status: 'OK', message: 'Saved Successfully' } }
    }

    mappedData = {
        address: () => this.deleteData('addresses')
    }
}

module.exports = MAPPED_DELETE