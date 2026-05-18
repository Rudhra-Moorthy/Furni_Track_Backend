const createEmployee = `

    INSERT INTO employee_details(
        user_id, 
        employee_code,
        first_name,
        last_name,
        department_id,
        designation_id,
        employment_type_id,
        gender,
        phone_number,
        date_of_joining
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *

`;

const getEmployees = `

    SELECT 
        e.id, 
        e.employee_code,
        e.first_name, 
        e.last_name,
        d.department_name,
        des.designation_name,
        et.name,
        e.date_of_joining

    FROM employee_details e
    
    JOIN departments d
    ON e.department_id = d.id

    JOIN designations des
    ON e.designation_id = des.id

    JOIN employement_types et
    ON e.employment_type_id = et.id

`;

module.exports = {
  createEmployee,
  getEmployees,
};
