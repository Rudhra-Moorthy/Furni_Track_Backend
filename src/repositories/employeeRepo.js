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
        e.date_of_joining,
        u.email,
        e.phone_number

    FROM employee_details e

    JOIN users u
    ON e.user_id = u.id
    
    JOIN departments d
    ON e.department_id = d.id

    JOIN designations des
    ON e.designation_id = des.id

    JOIN employment_types et
    ON e.employment_type_id = et.id

    WHERE e.deleted_at IS NULL
    ORDER BY e.created_at DESC
    LIMIT $1 OFFSET $2

`;

const updateEmployee = (fields, index) => `
    WITH updatedEmployee AS (
        UPDATE employee_details 
        SET ${fields.join(", ")}
        WHERE id = $${index} AND deleted_at IS NULL
        RETURNING * 
    )

    SELECT 
        e.id, 
        e.employee_code,
        e.first_name, 
        e.last_name,
        d.department_name,
        des.designation_name,
        et.name,
        e.date_of_joining,
        u.email,
        e.phone_number

    FROM updatedEmployee e

    JOIN users u
    ON e.user_id = u.id
    
    JOIN departments d
    ON e.department_id = d.id

    JOIN designations des
    ON e.designation_id = des.id

    JOIN employment_types et
    ON e.employment_type_id = et.id
`;

const getEmployee = `
    SELECT 
        e.id, 
        e.employee_code,
        e.first_name, 
        e.last_name,
        d.department_name,
        des.designation_name,
        et.name,
        e.date_of_joining,
        u.email,
        e.phone_number

    FROM employee_details e

    JOIN users u
    ON e.user_id = u.id
    
    JOIN departments d
    ON e.department_id = d.id

    JOIN designations des
    ON e.designation_id = des.id

    JOIN employement_types et
    ON e.employment_type_id = et.id

    WHERE id = $1 AND deleted_at IS NULL
    
`;

const deleteEmployee = `
    UPDATE employee_details
    SET 
        deleted_at = CURRENT_TIMESTAMP,
        employment_status = 'TERMINATED'
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING *
`;

const getEmployeeIdByName = `
    SELECT id 
    FROM employee_details
    WHERE 
        CONCAT(frist_name, ' ', last_name) ILIKE $1 AND 
        deleted_at IS NULL
`;

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeIdByName,
};
