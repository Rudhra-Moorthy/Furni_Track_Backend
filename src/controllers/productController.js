const productService = require("../services/productService");

const addProduct = async (req, res) => {
  try {
    if (!req.body.product_name) {
      return res.status(400).json({
        success: false,
        message: "Please enter product name!",
      });
    }

    const product = await productService.addProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProducts = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const products = await productService.getProducts(page, limit, search);

        return res.status(200).json({
            success: true,
            products
        });

    } catch (err) {
        
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
};

const getProduct = async (req, res) => {

    try {

        const product = await productService.getProduct(req.params.id);

        return res.status(200).json({
            success: true,
            product
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
};

const updateProduct = async (req, res) => {

    try {
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Atleast one field is required to update"
            });
        }

        const product = await productService.updateProduct(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
};

const deleteProduct = async (req, res) => {

    try {

        await productService.deleteProduct(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully!"
        });

    } catch (err) {

        return res.statusCode(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
};
