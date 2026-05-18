const getDesignationId = `
    SELECT id 
    FROM designations
    WHERE designation_name = $1
`;

module.exports = {
  getDesignationId,
};
