const userDto = require('../dto/userDto');

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
    return res.status(err.statusCode || 500).json({
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

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });

  }
};

// Get all users
const getUsers = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const users = await userService.getUsers(page, limit, search);

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (err) {

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });

  }
};

const updateUser = async (req, res) => {

  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      user : userDto(updatedUser)
    });

  } catch (err) {

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }

};

module.exports = {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
};
