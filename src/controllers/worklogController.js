const worklogService = require('../services/worklogService');

const createWorklog = async (req, res) => {

    try {

        const {
            department,
            worker,
            carving_person,
            turning_person,
            product_name,
            items_produced,
            work_date
        } = req.body;

        if(!department || !worker || !product || !items_produced || !work_date || !carving_person || !turning_person) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing!"
            });
        }

        const worklog = await worklogService.createWorklog(req.body);

        return res.status(201).json({
            success: true,
            message: "Work log created",
            worklog
        });


    } catch(err) {
        
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

};

const updateWorklog = async (req, res) => {

    try {

        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field required"
            });
        }

        const worklog = await worklogService.updateWorklog(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Worklog updated successfully!",
            worklog
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }
};

const getWorklogs = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const worklogs = await worklogService.getWorklogs(page, limit, search);

        return res.status(200).json({
            success: true,
            worklogs
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
        
    }

};

const getWorklog = async (req, res) => {

    try {

        const {id} = req.params;

        const worklog = await worklogService.getWorklog(id);

        return res.status(200).json({
            success: true,
            worklog
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

const deleteWorklog = async (req, res) => {

    try {

        await worklogService.deleteWorklog(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Worklog is deleted successfully!"
        });

    } catch (err) {

        return res.statusCode(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
  createWorklog,
  updateWorklog,
  getWorklogs,
  getWorklog,
  deleteWorklog,
};
