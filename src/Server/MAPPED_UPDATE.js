class MAPPED_UPDATE {
    constructor({ UTILS, params, SEPERATOR, STRINGIFYER, id }) {
        this.UTILS = UTILS
        this.params = params
        this.SEPERATOR = SEPERATOR
        this.STRINGIFYER = STRINGIFYER
        this.id = id
    }

    getKeys = data => Object.keys(data).reduce((res, key) => `${res}${res ? ',' : ''} ${key}=${typeof data[key] === 'string' ? this.UTILS.db.escape(data[key]) :
        typeof data[key] === 'object' ? this.UTILS.db.escape(JSON.stringify(data[key])) : data[key]
        }`, '')

    updateData = async table => {
        await this.UTILS.queryAsync(`
                UPDATE ${table} SET ${this.getKeys(this.STRINGIFYER(this.params))} WHERE id='${this.id}'
            `)
        return { result: { status: 'OK', message: 'Saved Successfully' } }
    }

    mapped_data = {
        category: () => this.updateData('categories'),
        discount: () => this.updateData('discounts'),
        brand: () => this.updateData('brands'),
        group: () => this.updateData('topar'),
        currency: () => this.updateData('currencies'),
        baner: () => this.updateData('baners'),
        product: () => this.updateData('products'),
        home: () => this.updateData('home_list'),
        client: async () => {
            await this.UTILS.queryAsync(`INSERT INTO clients(phone, name)VALUES('${this.id}', ${this.UTILS.db.escape(this.params.name)})
                ON DUPLICATE KEY UPDATE ${this.getKeys(this.STRINGIFYER(this.params))}
            `)
            return { result: { status: 'OK', message: 'Saved Successfully' } }
        }
    }
}

module.exports = MAPPED_UPDATE