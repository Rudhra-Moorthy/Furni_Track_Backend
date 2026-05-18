const employeeService = require('../services/employeeService');

// Get Employees
const getEmployees = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const employees = await employeeService.getEmployees(limit, page);

        return res.status(200).json({
            success: true,
            employees
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

// Update Employee
const updateEmployee = async (req, res) => {

    try {

        const { id } = req.params;

        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field os required."
            });
        }

        const employee = await employeeService.updateEmployee(id, req.body);

        return res.status(200).json({
            success: true,
            message: "Employee details are updated successfully.",
            employee
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

// Delete an employee 
const deleteEmployee = async (req, res) => {

    try {

        const {id} = req.params;

        if(req.user.id === Number(id)) {

            return res.status(400).json({
                success: false,
                message: "Admin can't delete their own details",
            }); 
        }

        await employeeService.deleteEmployee(id);

        return res.status(200).json({
            success: true,
            message: "Employee is deleted successfully!"
        });

    } catch (err) {

        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
}

module.exports = {
    updateEmployee, 
    getEmployees,
    deleteEmployee,
};