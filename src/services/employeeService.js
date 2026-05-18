const pool = require("../config/db");
const employee = require("../repositories/employeeRepo");
const { getEmploymentTypeId } = require("../services/employmentTypeService");
const { getDepartmentId } = require("../services/departmentService");
const { getDesignationId } = require("../services/designationService");

const addEmployee = async (client, employeeData) => {
  const {
    user_id,
    employee_code,
    first_name,
    last_name,
    department,
    designation,
    employment_type,
    gender,
    phone_number,
    data_of_joining,
  } = employeeData;

  let { id: employment_type_id } = await getEmploymentTypeId(employment_type);
  let { id: department_id } = await getDepartmentId(department);
  let { id: designation_id } = await getDesignationId(designation);

  console.log(employment_type_id, designation_id, department_id);

  const result = await client.query(employee.createEmployee, [
    user_id,
    employee_code,
    first_name,
    last_name,
    department_id,
    designation_id,
    employment_type_id,
    gender,
    phone_number,
    data_of_joining,
  ]);

  return result.rows[0];
};

const getEmployees = async () => {
  const result = await pool.query(employee.getEmployees);
  return result.rows;
};

module.exports = {
  addEmployee,
  getEmployees,
};
