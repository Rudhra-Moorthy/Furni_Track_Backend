const pool = require("../config/db");

const userService = require("../services/userService");

// Logic for create a user
const createUser = async (req, res, next) => {
  try {
    const result = await userService.createNewUser(req.body);

    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent Self delete
    if (req.user.id === Number(id)) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete own account",
      });
    }

    const result = await userService.deleteUser(id);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users available",
      });
    }

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createUser,
  deleteUser,
  getUsers,
};
