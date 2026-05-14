const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { createUser, deleteUser, getUsers } = require("../controller/userController");

// Admin can create users
router.get("/", authenticate, authorize('VIEW_USER'), getUsers);
router.post("/", authenticate, authorize('CREATE_USER'), createUser);
router.delete("/:id", authenticate, authorize('DELETE_USER'), deleteUser);

module.exports = router;
