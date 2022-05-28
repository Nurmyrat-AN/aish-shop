class MAPPED_INSERT {
    constructor({ UTILS, params, SEPERATOR, STRINGIFYER }) {
        this.UTILS = UTILS
        this.params = params
        this.SEPERATOR = SEPERATOR
        this.STRINGIFYER = STRINGIFYER
    }

    dataKeys = (data) => Object.keys(data).reduce((res, key) => `${res}${res ? ',' : ''}${key}`, '')
    dataValues = (data) => Object.values(data).reduce((res, val) => `${res}${res ? ',' : ''}${typeof val === 'string' ? this.UTILS.db.escape(val) : val}`, '')

    insertData = async table => {
        await this.UTILS.queryAsync(`INSERT INTO ${table}(${this.dataKeys(this.params)})VALUES(${this.dataValues(this.STRINGIFYER(this.params))})`)
        return { result: { status: 'OK', message: 'Saved Successfully' } }
    }

    mapped_data = {
        category: () => this.insertData('categories'),
        discount: () => this.insertData('discounts'),
        categoryBrandSupport: () => this.insertData('category_brand'),
        brand: () => this.insertData('brands'),
        product: () => this.insertData('products'),
        group: () => this.insertData('topar'),
        currency: () => this.insertData('currencies'),
        baner: () => this.insertData('baners'),
        address: () => this.insertData('addresses'),
        home: () => this.insertData('home_list'),
        order: async () => {
            const { information, products } = this.params
            const result = await this.UTILS.queryAsync(`INSERT INTO orders(${this.dataKeys(information)})VALUES(${this.dataValues(this.STRINGIFYER(information))})`)
            const order_id = result.insertId
            try {
                await Promise.all(products.map((product, idx) => this.UTILS.queryAsync(`INSERT INTO order_datas(order_id, product)VALUES(${order_id}, ${this.UTILS.db.escape(JSON.stringify(product))})`)))
            } catch (e) {
                await this.UTILS.queryAsync(`DELETE FROM orders WHERE id=${order_id}`)
                await this.UTILS.queryAsync(`DELETE FROM order_datas WHERE order_id=${order_id}`)
                throw e
            }
            return { result: { status: 'OK', message: 'Saved Successfully' } }
        },
    }
}

module.exports = MAPPED_INSERT