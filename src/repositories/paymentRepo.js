const getProductCost = `
    SELECT COALESCE(
                SUM(pi.unit_price, ppi.quantity), 
                0
           ) AS product_cost
    FROM product_production_items ppi

    JOIN production_items pi
    ON ppi.production_item_id = pi.id

    WHERE ppi.product_id = $1
`;

module.exports = {
  getProductCost,
};
