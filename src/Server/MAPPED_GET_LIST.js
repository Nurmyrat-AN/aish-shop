class MAPPED_GET_LIST {
    constructor({ UTILS, params, SEPERATOR, STRINGIFYER }) {
        this.UTILS = UTILS
        this.params = params
        this.SEPERATOR = SEPERATOR
        this.STRINGIFYER = STRINGIFYER
    }
    replaceSpaceToQuery = str => (str || '').split(' ').reduce((res, q) => `${res}%${q}%`, '%')

    getCategoriesID = async (categories) => categories.length === 0 ? categories : [...categories, ... await this.getCategoriesID((await this.UTILS.queryAsync(`SELECT id FROM categories WHERE parent IN(${categories.reduce((res, id) => `${res}${res ? ',' : ''}${id}`, '')})`)).map(c => c.id))]

    sepearateList = list => list.map(d => this.SEPERATOR(d))

    mapped_data = {
        categories: async () => ({
            categories: this.sepearateList(await this.UTILS.queryAsync(`SELECT *, COALESCE((SELECT json_arrayagg( brand_id ) FROM category_brand WHERE category_brand.category_id=categories.id), '[]') as brands FROM categories WHERE 
                                        ${this.params.id !== undefined ? `parent=${this.params.id}` : '1=1'} AND 
                                        ${this.params.search ? `name LIKE '%${this.replaceSpaceToQuery(this.params.search)}' ` : '1=1'} ORDER BY tertip, name`))
        }),
        brands: async () => ({
            brands: await this.sepearateList(await this.UTILS.queryAsync(`SELECT * FROM brands WHERE 
                                        ${this.params.id !== undefined ? `id IN (SELECT brand_id FROM category_brand WHERE category_id IN (${(await this.getCategoriesID([this.params.id])).reduce((res, id) => `${res}${res ? ',' : ''}${id}`, '')}))` : '1=1'} AND 
                                        ${this.params.search ? `name LIKE '%${this.replaceSpaceToQuery(this.params.search)}' ` : '1=1'} ORDER BY tertip, name`))
        }),
        products: async () => {
            const columns = `SELECT products.*, (CASE WHEN datas.id IS NULL THEN null ELSE JSON_OBJECT(
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
            )END) as data`
            const sql = `from products LEFT OUTER JOIN datas on products.uid=datas.id LEFT OUTER JOIN currencies ON datas.currency=currencies.id
                WHERE 
                ${this.params.category ? `category=${this.params.category}` : '1=1'}
                ${this.params.ids ? `AND products.id IN (${this.params.ids.reduce((res, id) => `${res}${res ? ',' : ''}${id}`, '')})` : ''}
                ${(this.params.categories || []).length > 0 ? `AND category IN (${(await this.getCategoriesID(this.params.categories)).reduce((res, id) => `${res}${res ? ',' : ''}${id}`, '')})` : ''}
                ${this.params.brand ? `AND brand=${this.params.brand}` : ''} 
                ${(this.params.brands || []).length > 0 ? `AND brand IN (${this.params.brands.reduce((res, id) => `${res}${res ? ',' : ''}${id}`, '')})` : ''}
                ${this.params.search ? `AND (
                    products.name LIKE '%${this.replaceSpaceToQuery(this.params.search)}' 
                    OR 
                    JSON_SEARCH(LOWER(key_words), 'all','%${this.replaceSpaceToQuery(this.params.search.toLowerCase())}')
                    OR
                    JSON_SEARCH(LOWER(name_lng), 'all','%${this.replaceSpaceToQuery(this.params.search.toLowerCase())}')
                    )` : ''}
                ${(this.params.groups || []).length > 0 ? `AND JSON_OVERLAPS(groups_base, '${JSON.stringify(this.params.groups || [])}')` : ''}
                ${this.params.withData ? `AND data.isactive='active'` : ''}
                
                `
            return {
                products: this.sepearateList(await this.UTILS.queryAsync(`${columns} ${sql} ORDER BY ${this.params.order ? `${this.params.order},` : ''} tertip, name, id LIMIT ${(this.params.page || 0) * 10}, 10`)),
                count: (await this.UTILS.queryAsync(`SELECT COUNT(*) as count ${sql}`))[0].count
            }
        },
        productDatas: async () => ({
            productDatas: this.sepearateList(await this.UTILS.queryAsync(`SELECT * FROM datas WHERE name LIKE '%${this.params.search || ''}%' LIMIT ${(this.params.page || 0) * 50}, 50`))
        }),
        groups: async () => ({
            groups: this.sepearateList(await this.UTILS.queryAsync(`SELECT * FROM topar WHERE name LIKE '%${this.replaceSpaceToQuery(this.params.search || '')}' ORDER BY tertip, id`))
        }),
        baners: async () => ({
            baners: this.sepearateList(await this.UTILS.queryAsync(`SELECT * FROM baners WHERE name LIKE '%${this.replaceSpaceToQuery(this.params.search || '')}' ORDER BY tertip, id`))
        }),
        currencies: async () => ({
            currencies: await this.UTILS.queryAsync(`SELECT * FROM currencies WHERE id LIKE '%${this.replaceSpaceToQuery(this.params.search || '')}' ORDER BY id`)
        }),
        categoryBrandSupport: async () => ({
            categoryBrandSupport: await this.UTILS.queryAsync(`SELECT * FROM ${this.params.category ? 'brands' : 'categories'} WHERE id IN (SELECT ${this.params.category ? 'brand_id' : 'category_id'} FROM category_brand WHERE ${this.params.category ? 'category_id' : 'brand_id'}=${this.params.category || this.params.brand})`)
        }),
        home: async () => ({
            home: this.sepearateList(await this.UTILS.queryAsync(`SELECT * FROM home_list WHERE name LIKE '%${this.replaceSpaceToQuery(this.params.search || '')}' ORDER BY tertip`))
        }),
        addresses: async () => ({
            addresses: await this.UTILS.queryAsync(`SELECT * FROM addresses WHERE phone='${this.params.phone}'`)
        }),
        orders: async () => ({
            orders: await UTILS.queryAsync(`SELECT * FROM orders WHERE phone='${this.params.phone}'`)
        })

    }
}

module.exports = MAPPED_GET_LIST