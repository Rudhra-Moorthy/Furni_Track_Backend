const express = require('express');
const { addProduct } = require('../controller/productController');
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post('/', authenticate, authorize('CREATE_PRODUCT'), addProduct);

module.exports = router;