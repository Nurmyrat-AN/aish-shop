class MAPPED_GET {
    constructor({ UTILS, params, SEPERATOR, STRINGIFYER }) {
        this.UTILS = UTILS
        this.params = params
        this.SEPERATOR = SEPERATOR
        this.STRINGIFYER = STRINGIFYER
    }
    mapped_data = {
        category: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM categories WHERE id=${this.params.id}`))[0]),
        brand: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM brands WHERE id=${this.params.id}`))[0]),
        group: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM topar WHERE id=${this.params.id}`))[0]),
        baner: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM baners WHERE id=${this.params.id}`))[0]),
        currency: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM currencies WHERE id='${this.params.id}'`))[0]),
        productdata: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT *, ((SELECT kurs FROM currencies WHERE id=datas.currency) OR 1) kurs FROM datas WHERE id='${this.params.id}'`))[0]),
        client: async () => ({ client: this.SEPERATOR((await this.UTILS.queryAsync(`SELECT * FROM clients WHERE phone='${this.params.phone}'`))[0] || { phone: this.params.phone, name: '' }) }),
        order: async () => this.SEPERATOR({
            information: (await this.UTILS.queryAsync(`SELECT * FROM orders WHERE id=${this.params.id}`))[0],
            products: (await this.UTILS.queryAsync(`SELECT product FROM order_datas WHERE order_id=${this.params.id}`)).map(data => JSON.parse(data.product))
        }),
        product: async () => this.SEPERATOR((await this.UTILS.queryAsync(`SELECT products.*, (CASE WHEN datas.id IS NULL THEN null ELSE JSON_OBJECT(
                                                                                    'id', datas.id,
                                                                                    'code', datas.code,
                                                                                    'name', datas.name,
                                                                                    'measure', datas.measure,
                                                                                    'price_base_for_sale', datas.price_base_for_sale,
                                                                                    'currency', datas.currency,
                                                                                    'isactive', datas.isactive,
                                                                                    'property_1', datas.property_1,
                                                                                    'property_2', datas.property_2,
                                                                                    'property_3', datas.property_3,
                                                                                    'property_4', datas.property_4,
                                                                                    'property_5', datas.property_5,
                                                                                    'kurs', (CASE WHEN currencies.kurs IS NULL THEN 1 ELSE currencies.kurs END)
                                                                                )END) as data from products LEFT OUTER JOIN datas on products.uid=datas.id LEFT OUTER JOIN currencies ON datas.currency=currencies.id
                                                                                    WHERE products.id=${this.params.id}`))[0])



    }
}

module.exports = MAPPED_GET