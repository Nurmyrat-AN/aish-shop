class MAPPED_GET {
    constructor({ UTILS, params, SEPERATOR, STRINGIFYER }) {
        this.UTILS = UTILS
        this.params = params
        this.SEPERATOR = SEPERATOR
        this.STRINGIFYER = STRINGIFYER
    }
    mapped_data = {
        discount: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM discounts WHERE id=${this.params.id}`))[0]),
        category: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM categories WHERE id=${this.params.id}`))[0]),
        brand: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM brands WHERE id=${this.params.id}`))[0]),
        group: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM topar WHERE id=${this.params.id}`))[0]),
        baner: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM baners WHERE id=${this.params.id}`))[0]),
        home: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM home_list WHERE id=${this.params.id}`))[0]),
        currency: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM currencies WHERE id='${this.params.id}'`))[0]),
        productdata: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT *, ((SELECT kurs FROM currencies WHERE id=datas.currency) OR 1) kurs FROM datas WHERE id='${this.params.id}'`))[0]),
        client: async () => ({ client: this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM clients WHERE phone='${this.params.phone}'`))[0] || { phone: this.params.phone, name: '' }) }),
        order: async () => this.SEPERATOR({
            information: (await this.UTILS.queryAsync(`SELECT * FROM orders WHERE id=${this.params.id}`))[0],
            products: (await this.UTILS.queryAsync(`SELECT product FROM order_datas WHERE order_id=${this.params.id}`)).map(data => JSON.parse(data.product))
        }),
        product: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM products_view WHERE id=${this.params.id}`))[0])



    }
}

module.exports = MAPPED_GET