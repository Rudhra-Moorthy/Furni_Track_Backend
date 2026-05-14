const getUserByEmail = `
      SELECT * FROM users 
      WHERE email = $1
`;

const getUsers = `
      SELECT * 
      FROM users
`;

const getUserIdAndRole = `
      SELECT u.id, u.email, r.name as role
      FROM users u
      JOIN user_roles ur
      ON u.id = ur.user_id
      JOIN roles r
      ON ur.role_id = r.id
      WHERE u.id = $1;
`;

const getUserRoles = `
      SELECT r.name FROM roles r
      JOIN user_roles ur
      ON ur.role_id = r.id
      WHERE ur.user_id = $1
`;

const createUser = `
      INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3)
      RETURNING id, name, email
`;

const getRoleIds = `
      SELECT id, name
      FROM roles 
      WHERE name = ANY($1)
`;

const assignRoles = `
      INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, $2)
`;

const removeUser = `
      UPDATE users 
      SET is_active = false 
      WHERE id = $1
`;

const getRoleById = `
      SELECT r.name 
      FROM roles r
      JOIN user_roles ur
      ON r.id = ur.role_id
      WHERE ur.user_id = $1
`;

const getPermissions = `
    SELECT p.key FROM permissions p
    JOIN role_permissions rp
    ON rp.permission_id = p.id
    JOIN roles r 
    ON r.id = rp.role_id
    JOIN user_roles ur 
    ON ur.role_id = r.id
    WHERE ur.user_id = $1
`;

module.exports = {
  getUserByEmail,
  getUserIdAndRole,
  getUserRoles,
  createUser,
  getRoleIds,
  assignRoles,
  removeUser,
  getPermissions,
  getRoleById,
  getUsers,
};
