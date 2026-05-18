const getEmploymentTypeId = `
    SELECT id FROM employment_types
    WHERE name = $1
`;

module.exports = {
  getEmploymentTypeId,
};
