const pool = require('../config/db');
const desg = require('../query/designationQuery');

const getDesignationId = async (desg_name) => {
    const result = await pool.query(desg.getDesignationId, [desg_name]);
    return result.rows[0];
}

module.exports = {
    getDesignationId
};
