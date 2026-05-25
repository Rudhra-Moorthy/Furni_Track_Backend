const pool = require("../config/db");
const employeeRepo = require("../repositories/employeeRepo");
const employeeDto = require("../dto/employeeDto");
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
    date_of_joining,
  } = employeeData;

  const { id: employment_type_id } = await getEmploymentTypeId(employment_type);
  const { id: department_id } = await getDepartmentId(department);
  const { id: designation_id } = await getDesignationId(designation);

  // console.log(employment_type_id, designation_id, department_id);

  const result = await client.query(employeeRepo.createEmployee, [
    user_id,
    employee_code,
    first_name,
    last_name,
    department_id,
    designation_id,
    employment_type_id,
    gender,
    phone_number,
    date_of_joining,
  ]);

  return result.rows[0];
};


// Get Employees 
const getEmployees = async (limit, page) => {
  const offset = (page - 1) * limit;
  const employees = await pool.query(employeeRepo.getEmployees, [
    limit,
    offset,
  ]);
  return employees.rows.map(employeeDto);
};

// Update Employee
const updateEmployee = async(id, data) => {

  const client = await pool.connect();

  try {

    await client.query('BEGIN');

    const fields = [];
    const values = [];

    let index = 1;

    if(data.first_name) {
      fields.push(`first_name = $${index++}`);
      values.push(data.first_name);
    }

    if(data.last_name) {
      fields.push(`last_name = $${index++}`);
      values.push(data.last_name);
    }

    if(data.phone_number) {
      fields.push(`phone_number = $${index++}`);
      values.push(data.phone_number);
    }

    if(data.employment_type) {
      fields.push(`employment_type_id = $${index++}`);

      const { id: employment_type_id } = await getEmploymentTypeId(data.employment_type); 
      values.push(employment_type_id);
    }

    if(data.department) {
      const department = await getDepartmentId(data.department);

      if(!department) {
        const err = new Error("Department is not found.");
        err.statusCode = 404;
        throw err;
      }

      fields.push(`department_id = $${index++}`);
      values.push(department.id);
    }

    if(data.designation) {
      const designation = await getDesignationId(data.designation);

      if(!designation) {
        const err = new Error("Designation is not found");
        err.statusCode = 404;
        throw err;
      }

      fields.push(`designation_id = $${index++}`);
      values.push(designation.id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = employeeRepo.updateEmployee(fields, index);

    const updatedEmployee = await client.query(query, values);

    if(updatedEmployee.rows.length === 0) {
      const err = new Error("Employee not found");
      err.statusCode = 404;
      throw err;
    }

    await client.query('COMMIT');
    return employeeDto(updatedEmployee.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Delete employee
const deleteEmployee = async (id) => {
  
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const deletedEmployee = await client.query(employeeRepo.deleteEmployee, [id]);

    if(deletedEmployee.rows.length === 0) {
      const err = new Error('Employee not found');
      err.statusCode = 404;
      throw err;
    }

    await client.query('COMMIT')

    return true;

  } catch(err) {

    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();
  }
}

const getEmployeeId = async (name) => {
  const employee = await pool.query(employeeRepo.getEmployeeIdByName, [name]);
  return employee.rows[0];
}

module.exports = {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeId,
};
