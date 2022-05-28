class MAPPED_DELETE {
    constructor({ UTILS, params, SEPERATOR, STRINGIFYER, id }) {
        this.UTILS = UTILS
        this.params = params
        this.SEPERATOR = SEPERATOR
        this.STRINGIFYER = STRINGIFYER
        this.id = id
    }

    deleteData = async (table) => {
        await this.UTILS.queryAsync(`DELETE FROM ${table} WHERE id='${this.id}'`)
        return { result: { status: 'OK', message: 'Saved Successfully' } }
    }

    mapped_data = {
        address: () => this.deleteData('addresses'),
        productDatas: () => this.deleteData('datas'),
        categoryBrandSupport: async () => {
            await this.UTILS.queryAsync(`DELETE FROM category_brand WHERE category_id='${this.params.category_id}' AND brand_id='${this.params.brand_id}'`)
            return { result: { status: 'OK', message: 'Saved Successfully' } }
        },
        homeitem: () => this.deleteData('home_list')
    }
}

module.exports = MAPPED_DELETE