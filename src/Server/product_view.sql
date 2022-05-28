SELECT products.*, (CASE WHEN datas.id IS NULL THEN null ELSE JSON_OBJECT(
                                          'id', datas.id,
                                          'code', datas.code,
                                          'name', datas.name,
                                          'measure', datas.measure,
                                          'price_base_for_sale', datas.price_base_for_sale,
                                          'discount', (SELECT JSON_OBJECT('amount', amount, 'type', actionType, 'name', name) FROM discounts WHERE 
                                                 (discounts.category=products.category AND discounts.category!=0) OR 
                                                 (discounts.brand=products.brand AND discounts.brand!=0) OR 
                                                 JSON_CONTAINS(discounts.products, CONCAT(products.id, ''))
                                                 ORDER BY discounts.priority DESC LIMIT 1),
                                          'currency', datas.currency,
                                          'isactive', datas.isactive,
                                          'property_1', datas.property_1,
                                          'property_2', datas.property_2,
                                          'property_3', datas.property_3,
                                          'property_4', datas.property_4,
                                          'property_5', datas.property_5,
                                          'kurs', (CASE WHEN currencies.kurs IS NULL THEN 1 ELSE currencies.kurs END)
                                   ) END) as 'data' from products LEFT OUTER JOIN datas on products.uid=datas.id LEFT OUTER JOIN currencies ON datas.currency=currencies.id