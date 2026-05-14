const pool = require("../config/db");
const et = require("../query/employmentTypeQuery");

const getEmploymentTypeId = async (name) => {
  const result = await pool.query(et.getEmploymentTypeId, [name]);
  return result.rows[0];
};

module.exports = {
  getEmploymentTypeId,
};
