const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const { updateEmployee, getEmployees, deleteEmployee } = require('../controllers/employeeController');

router.get('/', authenticate, authorize('VIEW_EMPLOYEE'), getEmployees);
router.patch('/:id', authenticate, authorize('UPDATE_EMPLOYEE'), updateEmployee);
router.delete('/:id', authenticate, authorize('DELETE_EMPLOYEE'), deleteEmployee);


module.exports = router;