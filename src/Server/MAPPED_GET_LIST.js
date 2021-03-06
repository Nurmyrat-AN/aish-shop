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
            const columns = `SELECT *`
            const sql = `from products_view
                WHERE 
                ${this.params.category ? `category=${this.params.category}` : '1=1'}
                ${this.params.ids ? `AND id IN (${this.params.ids.reduce((res, id) => `${res}${res ? ',' : ''}${id}`, '')})` : ''}
                ${(this.params.categories || []).length > 0 ? `AND category IN (${(await this.getCategoriesID(this.params.categories)).reduce((res, id) => `${res}${res ? ',' : ''}${id}`, '')})` : ''}
                ${this.params.brand ? `AND brand=${this.params.brand}` : ''} 
                ${(this.params.brands || []).length > 0 ? `AND brand IN (${this.params.brands.reduce((res, id) => `${res}${res ? ',' : ''}${id}`, '')})` : ''}
                ${this.params.search ? `AND (
                    name LIKE '%${this.replaceSpaceToQuery(this.params.search)}' 
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
        productDatas: async () => {
            const where = `WHERE ${this.params.search ? `name LIKE '%${this.params.search || ''}%'` : ' 1=1 '}
                            ${this.params.code ? `AND code LIKE '%${this.params.code || ''}%'` : ''}
                            ${this.params.isactive ? `AND isactive LIKE '%${this.params.isactive || ''}%'` : ''}
                            ${this.params.property_1 ? `AND property_1 LIKE '%${this.params.property_1 || ''}%'` : ''}
                            ${this.params.property_2 ? `AND property_2 LIKE '%${this.params.property_2 || ''}%'` : ''}
                            ${this.params.property_3 ? `AND property_3 LIKE '%${this.params.property_3 || ''}%'` : ''}
                            ${this.params.property_4 ? `AND property_4 LIKE '%${this.params.property_4 || ''}%'` : ''}
                            ${this.params.property_5 ? `AND property_5 LIKE '%${this.params.property_5 || ''}%'` : ''}
                            ${this.params.shop ? `AND shop LIKE '%${this.params.shop || ''}%'` : ''}`
            return {
                productDatas: this.sepearateList(await this.UTILS.queryAsync(`SELECT *, (SELECT COUNT(uid) FROM products WHERE uid=datas.id) as used FROM datas ${where} ORDER BY used LIMIT ${(this.params.page || 0) * (this.params.countPerPage || 10)}, ${this.params.countPerPage || 10}`)),
                count: (await this.UTILS.queryAsync(`SELECT COUNT(*) as count FROM datas ${where}`))[0].count
            }
        },
        groups: async () => ({
            groups: this.sepearateList(await this.UTILS.queryAsync(`SELECT * FROM topar WHERE name LIKE '%${this.replaceSpaceToQuery(this.params.search || '')}' ORDER BY tertip, id`))
        }),
        discounts: async () => ({
            discounts: this.sepearateList(await this.UTILS.queryAsync(`SELECT * FROM discounts WHERE name LIKE '%${this.replaceSpaceToQuery(this.params.search || '')}' ORDER BY priority, name, id`))
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