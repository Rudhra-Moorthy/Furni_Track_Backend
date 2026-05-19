const pool = require("../config/db");
const productRepo = require("../repositories/productRepo");
const productDto = require("../dto/productDto");

const addProduct = async (product) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // initiates the transaction

    // Get category id
    const category = await getCategoryId(client, product.category);
    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    // Get sub category id
    const sub_category = await getSubCategoryId(client, product.type);
    if (!sub_category) {
      const err = new Error("Sub-category not found");
      err.statusCode = 404;
      throw err;
    }

    // insert into products table
    const productResult = await addNewProduct(
      client,
      product.product_name,
      category.id,
      sub_category.id,
      product.description,
    );

    // Work type IDs
    const carvingType = await getWorkTypeId(client, "CARVING");
    const turningType = await getWorkTypeId(client, "TURNING");

    console.log(`Carving id: ${carvingType.id}\nTurning id: ${turningType.id}`);

    // create production items
    const carvingItem = await addProductionItem(
      client,
      product.carving_item,
      carvingType.id,
    );
    const turningItem = await addProductionItem(
      client,
      product.turning_item,
      turningType.id,
    );

    // Product Production Mapping
    await addProductProduction(
      client,
      productResult.id,
      carvingItem.id,
      1,
      turningItem.id,
      1,
    );

    await client.query("COMMIT");
    return getProduct(productResult.id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// get product
const getProduct = async (id) => {
  const product = await pool.query(productRepo.getProduct, [id]);

  if (product.rows.length === 0) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return productDto(product.rows[0]);
};

// get products
const getProducts = async (page, limit, search) => {
  const offset = (page - 1) * limit;

  const searchText = `%${search}%`;

  const products = await pool.query(productRepo.getProducts, [
    searchText,
    limit,
    offset,
  ]);

  return products.rows.map((p) => productDto(p));
};

// Update product
const updateProduct = async (id, data) => {

  const client = await pool.connect();

  try {

    await client.query('BEGIN');

    const fields = [];
    const values = [];

    let index = 1;

    // for product_name
    if(data.product_name) {
      fields.push(`product_name = $${index++}`);
      values.push(data.product_name);
    }

    // for description
    if(data.description) {
      fields.push(`description = $${index++}`);
      values.push(data.description);
    }

    // for category
    if(data.category) {
      const category = await getCategoryId(data.category);

      if(!category) {
        const err = new Error("Category not found");
        err.statusCode = 404;
        throw err;
      }

      fields.push(`category_id = $${index++}`);
      values.push(category.id);
    }

    // for sub category
    if(data.type) {
      const sub_category = await getSubCategoryId(data.type);

      if(!sub_category) {
        const err = new Error("Type not found");
        err.statusCode = 404;
        throw err;
      }

      fields.push(`sub_category_id = $${index++}`);
      values.push(sub_category.id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = productRepo.updateProduct(fields, index);

    const updated = await client.query(query, values);

    if(updated.rows.length === 0) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    await client.query('COMMIT');

    return productDto(updated.rows[0]);

  } catch (err) {

    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();
  }

}

// Delete product
const deleteProduct = async (id) => {

  const deleted = await pool.query(productRepo.deleteProduct, [id]);
  
  if(deleted.rows.length === 0) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return true;
}

const getCategoryId = async (client, category_name) => {
  const category = await client.query(productRepo.getCategoryId, [
    category_name,
  ]);
  return category.rows[0];
};

const getSubCategoryId = async (client, sub_category_name) => {
  const sub_category = await client.query(productRepo.getSubCategoryId, [
    sub_category_name,
  ]);
  return sub_category.rows[0];
};

const getWorkTypeId = async (client, work_name) => {
  const work_type = await client.query(productRepo.getWorkTypeId, [work_name]);
  return work_type.rows[0];
};

const addProductionItem = async (client, item_name, work_type_id) => {
  const items = await client.query(productRepo.addProductionItem, [
    item_name,
    work_type_id,
  ]);
  return items.rows[0];
};

const addNewProduct = async (
  client,
  product_name,
  category_id,
  sub_category_id,
  description,
) => {
  const result = await client.query(productRepo.addProduct, [
    product_name,
    category_id,
    sub_category_id,
    description,
  ]);

  return result.rows[0];
};

const addProductProduction = async (
  client,
  product_id,
  carving_id,
  carv_qty,
  turning_id,
  turn_qty,
) => {
  await client.query(productRepo.addProductProduction, [
    product_id,
    carving_id,
    carv_qty,
    turning_id,
    turn_qty,
  ]);
};

module.exports = {
  addProduct,
  getProduct,
  getProducts,
  deleteProduct,
  updateProduct,
};
