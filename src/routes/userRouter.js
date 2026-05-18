const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { createUser, deleteUser, getUsers, updateUser } = require("../controllers/userController");

// Admin can create users
router.get("/", authenticate, authorize('VIEW_USER'), getUsers);
router.post("/", authenticate, authorize('CREATE_USER'), createUser);
router.put("/:id", authenticate, authorize('UPDATE_USER'), updateUser)
router.delete("/:id", authenticate, authorize('DELETE_USER'), deleteUser);

module.exports = router;
