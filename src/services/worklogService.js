const pool = require("../config/db");
const worklogRepo = require("../repositories/worklogRepo");
const dto = require("../dto/worklogDto");
const dept = require("../services/departmentService");
const prouductService = require("../services/productService");
const employeeService = require("../services/employeeService");
const paymentService = require("../services/paymentService");
const worklogDto = require("../dto/worklogDto");

// Creates new worklog
const createWorklog = async (data) => {
  const client = pool.connect();

  try {
    await client.query("BEGIN");

    // Department
    const department = await dept.getDepartmentId(data.department);
    if (!department) {
      const err = new Error("Department not found");
      err.statusCode = 404;
      throw err;
    }

    // Product
    const product = await prouductService.getProductId(data.product_name);
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    // create worklog
    const worklog = await client.query(worklogRepo.createWorkLog, [
      department.id,
      product.id,
      data.items_produced,
      data.work_date,
    ]);

    // Work assignment
    const assignments = await addAssignments(client, worklog.rows[0].id, data.worker, data.turning_person, data.carving_person);

    // Calculate payment
    const totalPayment = await paymentService.calculatePayment(product.id, data.items_produced);

    // Create Payment 
    await client.query(worklogRepo.createPayment, [worklog.rows[0].id, totalPayment]);

    await client.query('COMMIT');

    return await getWorklog(worklog.rows[0].id);

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.release();
  }
};

const getWorklog = async (id) => {

    const worklog = await pool.query(worklogRepo.getWorklog, [id]);

    if(worklog.rows.length === 0) {
        const err = new Error("Work-Log not found");
        err.statusCode = 404;
        throw err;
    }

    return worklogDto(worklog.rows[0]);
}

const getWorklogs = async (page, limit, search) => {

    const offset = (page - 1) * limit;

    const searchText = `%${search}%`;

    const worklogs = await pool.query(worklogRepo.getWorklogs, [searchText, limit, offset]);

    return worklogs.rows.map(worklogDto);

}

const updateWorklog = async (id, data) => {

    const client = await pool.connect();

    try {

      await client.query('BEGIN');

      const fields = [];
      const values = [];

      let index = 1;

      // department
      if(data.department) {
        const department = await dept.getDepartmentId(data.department);
        fields.push(`department_id = $${index++}`);
        values.push(data.department);
      }

      // product
      let productId;
      if(data.product_name) {
        const product = await prouductService.getProductId(data.product_name);
        productId = product.id;

        fields.push(`product_id = $${index++}`);
        values.push(product.id);
      }

      // items
      if(data.items_produced) {
        fields.push(`items_produced = $${index++}`);
        values.push(data.items_produced);
      }

      // work date
      if(data.work_date) {
        fields.push(`work_date = $${index++}`);
        values.push(data.work_date);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = worklogRepo.updateWorkLog(fields, index);

      const updated = await client.query(query, values);

      if(updated.rows.length === 0) {
        const err = new Error("Worklog not found");
        err.statusCode = 404;
        throw err;
      }

      // Remove old assignments
      await client.query(worklogRepo.deleteAssignments, [id]);

      // add new assignments
      await addAssignments(client, id, data.worker, data.turning_person, data.carving_person);

      // update payment
      if(productId || data.items_produced) {

        const totalPayment = await paymentService.calculatePayment(
            productId || updated.rows[0].product_id, 
            data.items_produced || updated.rows[0].items_produced
        );

        await client.query(worklogRepo.updatePayment, [totalPayment, id]);

      }

      await client.query('COMMIT');

      return await getWorklog(id);

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

}

const deleteWorklog = async (id) => {

    const deleted = await pool.query(worklogRepo.deleteWorkLog, [id]);

    if(deleted.rows.length === 0) {
      const err = new Error("Worklog not found");
      err.statusCode = 404;
      throw err;
    }

    return true;

}

const addAssignments = async(client, id, worker, turning_person, carving_person)  => {

    const assignments = [
        {
          employee: worker,
          type: "WORKER",
        },
        {
          employee: carving_person,
          type: "CARVING",
        },
        {
          employee: turning_person,
          type: "TURNING",
        },
    ];

    for (let assignment of assignments) {
        if (assignment.employee) {
          const employee = await employeeService.getEmployeeId(
            assignment.employee,
          );
          await client.query(worklogRepo.createAssignment, [
            id,
            employee.id,
            assignment.type,
          ]);
        }
    }
}

module.exports = {
  createWorklog,
  getWorklog,
  updateWorklog,
  getWorklogs,
  deleteWorklog
};
