const pool = require("../config/db");
const { hashPassword } = require("../utils/hash");
const {
  getUserByEmail,
  addUser,
  getRoleIds,
  assignRoles,
  removeUser,
  getUserIdAndRole,
  getAllUsers
} = require("../service/userService");

const { addEmployee } = require('../service/employeeService');

// Logic for create a user
const createUser = async (req, res, next) => {

  const { 
      name, email, password, roles, 
      employee_code, first_name, last_name, 
      department, designation,
      employment_type, gender, phone_number, date_of_joining
  } = req.body;

    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

  const client = await pool.connect();

  try {

    await client.query('BEGIN'); //initiates the transaction

    

    // check existing user

    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // create user
    const user = await addUser(client, { name, email, hashedPassword });

    if (roles && Array.isArray(roles) && roles.length > 0) {
      // Get role IDs
      const roleIds = await getRoleIds(roles);

      if(roleIds.length != roles.length) {
        throw new Error("One or more roles are invalid!");
      }

      for (let roleId of roleIds) {
        await assignRoles(client, user.id, roleId);
      }
    }

    // create Employee

    const employee = await addEmployee(
      client, 
      {
        user_id: user.id,
        employee_code,
        first_name,
        last_name,
        department, 
        designation,
        employment_type,
        gender,
        phone_number,
        date_of_joining
      }
    );

    await client.query('COMMIT'); // saves the data in the table if nothing goes wrong

    return res.status(201).json({
      success: true,
      message: "User and Employee Created.",
      user,
      employee
    });

  } catch (err) {

    await client.query('ROLLBACK');
    return res.status(400).json({
      success: false,
      message: err.message,
    });

  } finally {
    client.release(); // ends the transaction
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

    const user = await getUserIdAndRole(id);
    console.log('User', user);

    // check user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting another admin
    if (user.roles.includes( "Admin")) {
      return res.status(500).json({
        success: false,
        message: "Admin cannot delete another admin",
      });
    }

    await removeUser(id);

    return res.status(200).json({
      success: true,
      message: "User is successfully deleted.",
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
    const users = await getAllUsers();

    if(users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users available"
      });
    }

    return res.status(200).json({
      success: true,
      users
    });

  }
  catch(err) {

    return res.status(500).json({
      success: false, 
      message: err.message
    });

  }



}

module.exports = {
  createUser,
  deleteUser,
  getUsers,
};
