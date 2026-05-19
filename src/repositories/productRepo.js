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

const getWorkTypeId = `
    SELECT id, work_name 
    FROM work_types
    WHERE work_name = $1
`;

// Creates a new product
const addProduct = `
    INSERT INTO products (product_name, category_id, sub_category_id, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
`;

// Creates production item
const addProductionItem = `
    INSERT INTO production_items (item_name, work_type_id)
    VALUES($1, $2)
    RETURNING *;
`;

// Maps the product items...
const addProductProduction = `
    INSERT INTO product_production_items (product_id, production_item_id, qunatity)
    VALUES ($1, $2, $3), ($1, $4, $5);
`;

// gets the products list
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

    WHERE 
        p.deleted_at IS NULL 
        AND (
            p.product_name ILIKE $1 
            OR 
            c.category_name ILIKE $1 
            OR
            sc.sub_category_name ILIKE $1
        )

    GROUP BY p.id, p.product_name, p.description, c.category_name, sc.sub_category_name
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
`;

// Get products count
const getProductsCount = `
    SELECT COUNT(*) as total, COUNT(DISTINCT p.category_id) as categories
    FROM products p
    WHERE p.deleted_at IS NULL
`;

//  Get product
const getProduct = `
    SELECT 
        p.id, 
        p.product_name, 
        p.description, 
        c.category_name, 
        sc.sub_category_name AS type,

        MAX (
            CASE
            WHEN wt.work_name = 'CARVING'
            THEN pi.item_name
            END
        ) AS carving_item,

        MAX (
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

    WHERE p.id = $1 AND p.deleted_at IS NULL 
    GROUP BY p.id, p.product_name, p.description, c.category_name, sc.sub_category_name

`;

const updateProduct = (fields, index) => `

    WITH updatedProduct AS (
        UPDATE products
        SET ${fields.join(", ")}

        WHERE id = $${index} AND deleted_at IS NULL
        RETURNING *
    )

    SELECT 
        p.id, 
        p.product_name, 
        p.description, 
        c.category_name, 
        sc.sub_category_name AS type,

        MAX (
            CASE
            WHEN wt.work_name = 'CARVING'
            THEN pi.item_name
            END
        ) AS carving_item,

        MAX (
            CASE
            WHEN wt.work_name = 'TURNING'
            THEN pi.item_name
            END
        ) AS turning_item

    FROM updatedProduct p
    
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

    GROUP BY p.id, p.product_name, c.category_name, sc.sub_category_name, p.description
`;

const deleteProduct = `
    UPDATE products
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1
    AND deleted_at IS NULL
    RETURNING *
`;

module.exports = {
  getCategoryId,
  getSubCategoryId,
  addProduct,
  getWorkTypeId,
  addProductionItem,
  addProductProduction,
  getProductsCount,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
};
