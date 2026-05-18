const pool = require("../config/db");
const productRepo = require("../repositories/productRepo");

const addProduct = async (product) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // initiates the transaction

    // Get category id
    const { id: category_id } = await getCategoryId(client, product.category);

    // Get sub category id
    const { id: sub_category_id } = await getSubCategoryId(
      client,
      product.type,
    );

    // insert into products table
    const productResult = await addNewProduct(
      client,
      product.product_name,
      category_id,
      sub_category_id,
      product.description,
    );

    // Work type IDs
    const { id: carvingId } = await getWorkTypeId(client, "CARVING");
    const { id: turningId } = await getWorkTypeId(client, "TURNING");

    console.log(`Carving id: ${carvingId}\nTurning id: ${turningId}`);

    // create production items
    const carvingItem = await addProductionItem(
      client,
      product.carving_item,
      carvingId,
    );
    const turningItem = await addProductionItem(
      client,
      product.turning_item,
      turningId,
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
    return productResult;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

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
};
