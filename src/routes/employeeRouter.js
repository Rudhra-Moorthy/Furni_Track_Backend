const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const {
  updateEmployee,
  getEmployees,
  deleteEmployee,
} = require("../controllers/employeeController");

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee Management APIs
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *      summary: Get all employees
 *      tags: [Employees]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *        200:
 *          description: Employees fetched successfully
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Permission denied
 *        500:
 *          description: Server side error
 *
 */
router.get("/", authenticate, authorize("VIEW_EMPLOYEE"), getEmployees);

/**
 * @swagger
 * /api/employees{id}:
 *   patch:
 *      summary: Update employee details
 *      tags: [Employees]
 *
 *      security:
 *          - bearerAuth: []
 *
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            example: 1
 *
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *
 *                          first_name:
 *                              type: string
 *                              example: John
 *
 *                          last_name:
 *                              type: string
 *                              example: Doe
 *
 *                          phone_number:
 *                              type: string
 *                              example: 9876543210
 *
 *                          department:
 *                              type: string
 *                              example: IT
 *
 *                          designation:
 *                              type: string
 *                              example: Software Engineer
 *
 *                          employment_type:
 *                              type: string
 *                              example: FULL_TIME
 *
 *      responses:
 *          200:
 *              description: Employee updated successfully
 *          400:
 *              description: Atleast one field is required
 *          404:
 *              description: Employee/Department/Designation not found
 *          403:
 *              description: Permission denied
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Server side error
 *
 */
router.patch(
  "/:id",
  authenticate,
  authorize("UPDATE_EMPLOYEE"),
  updateEmployee,
);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *      summary: Delete employee
 *      tags: [Employees]
 *
 *      security:
 *          - bearerAuth: []
 *
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            example: 1
 *
 *      responses:
 *          200:
 *              description: Employee deleted successfully
 *          400:
 *              description: Admin cannot delete own details
 *          404:
 *              description: Employee not found
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Permission denied
 *          500:
 *              description: Server side error
 */
router.delete(
  "/:id",
  authenticate,
  authorize("DELETE_EMPLOYEE"),
  deleteEmployee,
);

module.exports = router;
