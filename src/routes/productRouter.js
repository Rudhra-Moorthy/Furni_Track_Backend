const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products Management APIs
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *      summary: Create a new product
 *      tags: [Products]
 * 
 *      security: 
 *          - bearerAuth: []
 *      
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json:
 *                schema:
 *                  type: object
 * 
 *                  required:
 *                    - product_name
 *                    - category
 *                    - type
 * 
 *                  properties:
 *                      
 *                      product_name:
 *                          type: string
 *                          example: Wooden Chair
 * 
 *                      category:
 *                          type: string
 *                          example: Furniture
 * 
 *                      type:
 *                          type: string
 *                          example: Chair
 * 
 *                      description:
 *                          type: string
 *                          example: Premium Wooden Chair
 * 
 *                      carving_item:
 *                          type: object
 *                          properties:
 *                            name: 
 *                              type: string
 *                              example: Floral Carving
 * 
 *                            quantity:
 *                              type: integer
 *                              example: 2
 * 
 *                            unit_price:
 *                              type: number
 *                              example: 210
 * 
 *                      turning_item:
 *                          type: object
 *                          properties:
 *                            name: 
 *                              type: string
 *                              example: Round leg Turning
 * 
 *                            quantity:
 *                              type: integer
 *                              example: 4
 * 
 *                            unit_price:
 *                              type: number
 *                              example: 100
 * 
 *      responses: 
 *        201:
 *          description: Product created successfully
 * 
 *        400:
 *          description: Product name required
 * 
 *        401:
 *          description: Unauthorized
 * 
 *        403:
 *          description: Permission denied
 * 
 *        404:
 *          description: Category/Sub-catgeory not found
 * 
 *        500: 
 *          description: Server side error
  
 */
router.post(
  "/",
  authenticate,
  authorize("CREATE_PRODUCT"),
  productController.addProduct,
);


/**
 * @swagger
 * /api/products:
 *   get:
 *      summary: Get all products
 *      tags: [Products]
 * 
 *      security: 
 *        - bearerAuth: []
 * 
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          example: 1
 *          description: Current page
 *
 *        - in: query
 *          name: limit
 *          schema: 
 *            type: integer
 *          example: 10
 *          description: Records per page
 * 
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *          example: chair
 *          description: Search by product name
 * 
 *      responses: 
 *        200:
 *          description: Products fetched successfully
 *  
 *        401: 
 *          description: Unauthorized
 * 
 *        403:
 *          description: Permission denied
 * 
 *        500:
 *          description: Server side error
 * 
 */
router.get(
  "/",
  authenticate,
  authorize("VIEW_PRODUCT"),
  productController.getProducts,
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *    summary: Get single product
 *    tags: [Products]
 * 
 *    security: 
 *      - bearerAuth: []
 * 
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        example: 1
 * 
 *    responses:
 *      200:
 *        description: Product fetched successfully
 * 
 *      404:
 *        description: Product not found
 */
router.get(
  "/:id",
  authenticate,
  authorize("VIEW_PRODUCT"),
  productController.getProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *      summary: Update product
 *      tags: [Products]
 * 
 *      security: 
 *        - bearerAuth: []
 * 
 *      parameters: 
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          example: 1
 *      
 *      requestBody: 
 *        required: true 
 *        content: 
 *            application/json:
 *                schema: 
 *                  type: object
 *                  
 *                  properties:
 *                  
 *                    product_name:
 *                      type: string
 *                      example: Premium Chair
 *      
 *                    description:
 *                      type: string
 *                      example: Updated description
 * 
 *                    carving_item:
 *                      type: string
 *                      example: updated carving_item
 * 
 *                    turning_item:
 *                      type: string
 *                      example: updated turning_item 
 *                          
 *                    catgeory:
 *                      type: string
 *                      example: Furniture
 *    
 *                    type:
 *                      type: string
 *                      example: Chair
 *      
 *      responses:
 *        200:
 *          description: Product updated successfully
 *    
 *        400:
 *          description: Atleast one field required
 * 
 *        404:
 *          description: Product/category/type not found
 * 
 *        500:
 *          description: Server side error              
 */
router.patch(
  "/:id",
  authenticate,
  authorize("UPDATE_PRODUCT"),
  productController.updateProduct,
);


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *      summary: Delete product
 *      tags: [Products]
 * 
 *      security: 
 *        - bearerAuth: []
 * 
 *      parameters: 
 *        - in: path
 *          name: id
 *          required: true
 *          schema: 
 *            type: integer
 *          example: 1
 * 
 *      responses: 
 *        200: 
 *          description: Product deleted successfully
 *      
 *        404:
 *          description: Product not found
 *      
 *        500:
 *          description: Server side error
 */
router.delete(
  "/:id",
  authenticate,
  authorize("DELETE_PRODUCT"),
  productController.deleteProduct,
);

module.exports = router;
