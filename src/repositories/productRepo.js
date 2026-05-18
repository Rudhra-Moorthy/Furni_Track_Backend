const getCategoryId = `
    SELECT id 
    FROM categories 
    WHERE category_name = $1
`;

const getSubCategoryId = `
    SELECT id 
    FROM sub_categories
    WHERE sub_category_name = $1
`;

const addProduct = `
    INSERT INTO products (product_name, category_id, sub_category_id, description)
    VALUES ($1, $2, $3, $4)
    RETURNING id, product_name, description;
`;

const getWorkTypeId = `
    SELECT id, work_name 
    FROM work_types
    WHERE work_name = $1
`;

const addProductionItem = `
    INSERT INTO production_items (item_name, work_type_id)
    VALUES($1, $2)
    RETURNING *;
`;

const addProductProduction = `
    INSERT INTO product_production_items (product_id, production_item_id, qunatity)
    VALUES ($1, $2, $3), ($1, $4, $5);
`;

const getProducts = `
    SELECT p.id, p.product_name, p.description, c.category_name, sc.sub_category_name AS type,
    MAX(
        CASE 
        WHEN wt.work_name = 'CARVING'
        THEN pi.item_name
        END
    ) AS carving_item, 

    MAX(
        CASE 
        WHEN wt.work_name = 'TURNING'
        THEN pi.item_name
        END
    ) AS turning_item

    FROM products p

    JOIN categories c 
    ON p.category_id = c.id

    JOIN sub_categories sc
    ON p.sub_category_id = sc.id

    JOIN product_production_items ppi
    ON p.id = ppi.product_id

    JOIN production_items pi 
    ON ppi.production_item_id = pi.id

    JOIN work_types wt
    ON pi.work_type_id = wt.id

    GROUP BY p.id, c.category_name, sc.sub_category_name
`;

module.exports = {
  getCategoryId,
  getSubCategoryId,
  addProduct,
  getWorkTypeId,
  addProductionItem,
  addProductProduction,
};
