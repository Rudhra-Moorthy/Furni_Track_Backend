const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

// post request
router.post(
  "/",
  authenticate,
  authorize("CREATE_PRODUCT"),
  productController.addProduct,
);

// get request
router.get(
  "/",
  authenticate,
  authorize("VIEW_PRODUCT"),
  productController.getProducts,
);

router.get(
  "/:id",
  authenticate,
  authorize("VIEW_PRODUCT"),
  productController.getProduct,
);

// update request
router.patch(
  "/:id",
  authenticate,
  authorize("UPDATE_PRODUCT"),
  productController.updateProduct,
);

// delete request
router.delete(
  "/:id",
  authenticate,
  authorize("DELETE_PRODUCT"),
  productController.deleteProduct,
);

module.exports = router;
