const pool = require("../config/db");
const user = require("../query/userQuery");

// Get User by Email
const getUserByEmail = async (email) => {
  const result = await pool.query(user.getUserByEmail, [email]);

  return result.rows[0];
};

// Get users details
const getAllUsers = async () => {
  const result = await pool.query(user.getUsers);
  return result.rows;
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
const removeUser = async (id) => {
  await pool.query(user.removeUser, [id]);
};

// get permissions...
const getPermissions = async (id) => {
  const result = await pool.query(user.getPermissions, [id]);
  return result.rows.map((row) => row.key);
};

module.exports = {
  getUserByEmail,
  getUserRoles,
  addUser,
  getRoleIds,
  assignRoles,
  removeUser,
  getUserIdAndRole,
  getAllUsers,
  getPermissions,
};
