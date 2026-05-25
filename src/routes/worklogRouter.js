const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const worklogController = require("../controllers/worklogController");

/**
 * @swagger
 * tags:
 *   name: Worklogs
 *   description: Worklogs Management APIs
 */

/**
 * @swagger
 * /api/worklogs:
 *   post:
 *      summary: Create a new worklog
 *      tags: [Worklogs]
 *
 *      security:
 *          - bearerAuth: []
 *
 *      requestBody:
 *          required: true
 * 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - department
 *                          - worker
 *                          - carving_person
 *                          - turning_person
 *                          - product_name
 *                          - work_date
 *                          - items_produced
 *
 *                      properties:
 *                          department:
 *                              type: string
 *                              example: Carpenter
 *
 *                          worker:
 *                              type: string
 *                              example: John Doe
 *
 *                          carving_person:
 *                              type: string
 *                              example: Jane Smith
 *
 *                          turning_person:
 *                              type: string
 *                              example: Emma Davis
 *
 *                          product_name:
 *                              type: string
 *                              example: Dining Table
 *
 *                          product_code:
 *                              type: string
 *                              example: PT001
 *
 *                          items_produced:
 *                              type: integer
 *                              example: 0
 *
 *                          work_date:
 *                              type: string
 *                              example: yyyy-mm-dd
 *
 *      responses:
 *        201:
 *          description: Worklog created successfully
 *
 *        400:
 *          description: validation error
 *
 *        401:
 *          description: Unauthorized
 *
 *        403:
 *          description: Permission denied
 *
 *        404:
 *          description: Department/Product not found
 *
 *        500:
 *          description: Server side error
 */
router.post(
  "/",
  authenticate,
  authorize("CREATE_WORK_LOG"),
  worklogController.createWorklog,
);

/**
 * @swagger
 * /api/worklogs:
 *   get:
 *      summary: Get all worklogs
 *      tags: [Worklogs]
 * 
 *      security: 
 *          - bearerAuth: []
 * 
 *      parameters:
 *          - in: query
 *            name: page
 *            schema: 
 *              type: integer
 *            example: 1
 *            description: Current page
 * 
 *          - in: query
 *            name: limit
 *            schema: 
 *              type: integer
 *            example: 10
 *            description: Records per page
 * 
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            example: Carpenter
 *            description: Search by department
 * 
 *      responses:
 *          200:
 *              description: Worklogs fetched successfully
 *         
 *          401:
 *              description: Unauthorized
 * 
 *          403:
 *              description: Permission denied
 * 
 *          500:
 *              description: Server side error
 */
router.get(
  "/",
  authenticate,
  authorize("VIEW_WORK_LOG"),
  worklogController.getWorklogs,
);

/**
 * @swagger
 * /api/worklogs/{id}:
 *   patch:
 *      summary: Update worklog
 *      tags: [Worklogs]
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
 * 
 *                      properties:
 *                          department:
 *                              type: string
 *                              example: Carpenter
 *
 *                          worker:
 *                              type: string
 *                              example: John Doe
 *
 *                          carving_person:
 *                              type: string
 *                              example: Jane Smith
 *
 *                          turning_person:
 *                              type: string
 *                              example: Emma Davis
 *
 *                          product_name:
 *                              type: string
 *                              example: Dining Table
 *
 *                          product_code:
 *                              type: string
 *                              example: PT001
 *
 *                          items_produced:
 *                              type: integer
 *                              example: 0
 *
 *                          work_date:
 *                              type: string
 *                              example: yyyy-mm-dd 
 * 
 *      responses: 
 *          200: 
 *              description: Worklog fetched successfully
 * 
 *          400:
 *              description: Atleast one field required
 * 
 *          404:
 *              description: Worklog not found
 * 
 *          500:
 *              description: Server side error
 */
router.patch(
  "/:id",
  authenticate,
  authorize("UPDATE_WORK_LOG"),
  worklogController.updateWorklog,
);

/**
 * @swagger
 * /api/worklogs/{id}:
 *   delete:
 *      summary: Delete worklog
 *      tags: [Worklogs]
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
 *              description: Worklog deleted successfully
 * 
 *          404:
 *              description: Worklog not found
 * 
 *          500:
 *              description: Server side error
 */
router.delete(
  "/:id",
  authenticate,
  authorize("DELETE_WORK_LOG"),
  worklogController.deleteWorklog,
);

module.exports = router;
