const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management APIs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Server side error
 */
router.get("/", authenticate, authorize("VIEW_USER"), getUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create user and employee
 *     tags: [Users]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - name
 *               - email
 *               - password
 *               - roles
 *               - employee_code
 *               - first_name
 *               - last_name
 *               - department
 *               - designation  
 *               - employment_type
 *               - gender
 *               - phone_number
 *               - date_of_joining
 *
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: John Doe
 *
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: Password123
 *
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - ADMIN
 *                   - MANAGER
 *
 *               employee_code:
 *                 type: string
 *                 example: EMP001
 *
 *               first_name:
 *                 type: string
 *                 example: John
 *
 *               last_name:
 *                 type: string
 *                 example: Doe
 *
 *               department:
 *                 type: string
 *                 example: IT
 *
 *               designation:
 *                 type: string
 *                 example: Software Engineer
 *
 *               employment_type:
 *                 type: string
 *                 example: FULL_TIME
 *
 *               gender:
 *                 type: string
 *                 example: MALE
 *
 *               phone_number:
 *                 type: string
 *                 example: 9876543210
 *
 *               date_of_joining:
 *                 type: string
 *                 format: date
 *                 example: 2026-05-20
 *
 *     responses:
 *       201:
 *         description: User and Employee created successfully
 *
 *       400:
 *         description: Validation Error
 *
 *       409:
 *         description: Email already exists
 *
 *       500:
 *         description: Server Error
 */
router.post("/", authenticate, authorize("CREATE_USER"), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *
 *               email:
 *                 type: string
 *                 example: updated@gmail.com
 *
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.put("/:id", authenticate, authorize("UPDATE_USER"), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.delete("/:id", authenticate, authorize("DELETE_USER"), deleteUser);

module.exports = router;
