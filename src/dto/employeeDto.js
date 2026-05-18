const employeeDto = (employee) => {
  return {
    id: employee.id,
    employee_code: employee.employee_code,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone_number: employee.phone_number,
    department: employee.department_name,
    designation: employee.designation_name,
    employment_type: employee.employment_type,
    date_of_joining: employee.date_of_joining,
  };
};

module.exports = employeeDto;
