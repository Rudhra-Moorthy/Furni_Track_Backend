const pool = require("../config/db");

const paymentRepo = require("../repositories/paymentRepo");

const calculatePayment = async (product_id, items_produced) => {
  const payment = await pool.query(paymentRepo.getProductCost, [product_id]);

  const productCost = Number(payment.rows[0].product_cost);

  if (productCost === 0) {
    const err = new Error("Product cost not found");
    err.statusCode = 404;
    throw err;
  }

  return productCost * items_produced;
};

module.exports = {
  calculatePayment,
};
