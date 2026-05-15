const productService = require('../service/productService');

const addProduct = async (req, res) => {

    try {

        if(!req.body.product_name) {
            return res.status(400).json({
                success: false,
                message: 'Please enter product name!'
            });
        }

        const product = await productService.addProduct(req.body);

        return res.status(201).json({
            success: true,
            message: "Product created successfully!",
            product
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

const getProducts = async (req, res) => {

}

const updateProduct = async (req, res) => {

}

const deleteProduct = async (req, res) => {

}

module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct
};