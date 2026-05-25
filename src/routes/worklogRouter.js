const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const worklogController = require('../controllers/worklogController');

router.post('/', authenticate, authorize('CREATE_WORK_LOG'), worklogController.createWorklog);

router.get('/', authenticate, authorize("VIEW_WORK_LOG"), worklogController.getWorklogs);

router.patch('/:id', authenticate, authorize('UPDATE_WORK_LOG'), worklogController.updateWorklog);

router.delete('/:id', authenticate, authorize('DELETE_WORK_LOG'), worklogController.deleteWorklog);

module.exports = router;