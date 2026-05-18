const getDepartmentId = `
    SELECT id
    FROM departments
    WHERE department_name = $1
`;

module.exports = {
  getDepartmentId,
};
