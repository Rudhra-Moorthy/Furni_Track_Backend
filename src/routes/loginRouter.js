const { login } = require("../controllers/loginController");

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication API
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *      summary: Login User
 *      tags: [Authentication]
 *
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *
 *                      required:
 *                          - email
 *                          - password
 *
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: john@gmail.com
 *
 *                          password:
 *                              type: string
 *                              example: Password123
 *
 *      responses:
 *          200:
 *              description: Login Successful
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *
 *                          properties:
 *
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *
 *                              message:
 *                                  type: string
 *                                  example: Login Successful
 *
 *                              token:
 *                                  type: string
 *                                  example: eyJhbGciOiJIUzI1NiIsInR5...
 *
 *          400:
 *              description: Email and password required
 *
 *          401:
 *              description: Invalid email or password
 *
 */
router.post("/login", login);

module.exports = router;
