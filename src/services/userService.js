const pool = require("../config/db");
const user = require("../repositories/userRepo");
const { hashPassword } = require("../utils/hash");
const { addEmployee } = require("../services/employeeService");
const userDto = require("../dto/userDto");

// create new user
const createNewUser = async (data) => {
  const {
    name,
    email,
    password,
    roles,
    employee_code,
    first_name,
    last_name,
    department,
    designation,
    employment_type,
    gender,
    phone_number,
    date_of_joining,
  } = data;

  if (!name || !password || !email) {
    const err = new Error(
      "Name, email and password are required to create new user.",
    );
    err.statusCode = 400;
    throw err;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); //initiates the transaction

    // check existing user
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      const err = new Error("Email already exists");
      err.statusCode = 409;
      throw err;
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // create user
    const user = await addUser(client, { name, email, hashedPassword });

    if (roles && Array.isArray(roles) && roles.length > 0) {
      // Get role IDs
      const roleIds = await getRoleIds(roles);

      if (roleIds.length != roles.length) {
        const err = new Error("One or more roles are invalid!");
        err.statusCode = 400;
        throw err;
      }

      for (let roleId of roleIds) {
        await assignRoles(client, user.id, roleId);
      }
    }

    // create Employee
    const employee = await addEmployee(client, {
      user_id: user.id,
      employee_code,
      first_name,
      last_name,
      department,
      designation,
      employment_type,
      gender,
      phone_number,
      date_of_joining,
    });

    await client.query("COMMIT"); // saves the data in the table if nothing goes wrong

    return {
      message: "User and Employee Created.",
      user,
      employee,
    };
  } catch (err) {
    await client.query("ROLLBACK"); // reverts the changes...

    throw new Error(err);
  } finally {
    client.release(); // ends the transaction
  }
};

//Delete user
const deleteUser = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const user = await getUserIdAndRole(id);
    console.log("User", user);

    // check user exists
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    // Prevent deleting another admin
    if (user.roles.includes("Admin")) {
      const err = new Error("Admin cannot delete another admin");
      err.statusCode = 403;
      throw err;
    }

    await removeUser(client, id);
    await client.query("COMMIT");

    return {
      message: "User is successfully deleted.",
    };
  } catch (err) {
    f;
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Update User
const updateUser = async (id, { name, email }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Starts the transaction

    const existingUser = await client.query(user.getUserById, [id]);

    if (!existingUser.rows[0]) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const updatedUser = await client.query(user.updateUser, [name, email, id]);

    await client.query("COMMIT");

    return updatedUser.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Get User by Email
const getUserByEmail = async (email) => {
  const result = await pool.query(user.getUserByEmail, [email]);
  return result.rows[0];
};

// Get users details
const getUsers = async (page, limit, search) => {
  try {
    const offset = (page - 1) * limit;
    const users = await pool.query(user.getUsers, [limit, offset]);
    return users.rows.map(userDto);
  } catch (err) {
    throw err;
  }
};

const getUserIdAndRole = async (id) => {
  const result = await pool.query(user.getUserIdAndRole, [id]);
  return result.rows[0];
};

// Get user roles
const getUserRoles = async (id) => {
  const result = await pool.query(user.getUserRoles, [id]);

  return result.rows.map((row) => row.name);
};

// add user
const addUser = async (client, { name, email, hashedPassword }) => {
  const result = await client.query(user.createUser, [
    name,
    email,
    hashedPassword,
  ]);
  return result.rows[0];
};

// Get role ids
const getRoleIds = async (roles) => {
  const result = await pool.query(user.getRoleIds, [roles]);

  return result.rows.map((role) => role.id);
};

// Assign roles..
const assignRoles = async (client, user_id, role_id) => {
  await client.query(user.assignRoles, [user_id, role_id]);
};

// delete user
const removeUser = async (client, id) => {
  await client.query(user.removeUser, [id]);
};

// get permissions...
const getPermissions = async (id) => {
  const result = await pool.query(user.getPermissions, [id]);
  return result.rows.map((row) => row.key);
};

module.exports = {
  createNewUser,
  deleteUser,
  getUserByEmail,
  getUserRoles,
  addUser,
  getRoleIds,
  assignRoles,
  removeUser,
  getUserIdAndRole,
  getUsers,
  getPermissions,
  updateUser,
};
