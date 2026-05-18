const pool = require("../config/db");
const dept = require("../repositories/departmentRepo");

const getDepartmentId = async (dept_name) => {
  const result = await pool.query(dept.getDepartmentId, [dept_name]);
  return result.rows[0];
};

module.exports = {
  getDepartmentId,
};
