const createWorkLog = `
    INSERT INTO worklogs(
        department_id,
        product_id,
        items_produced
        work_date
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
`;

const createAssignment = `
    INSERT INTO work_assignments (
        work_log_id,
        employee_id,
        work_type
    )
    VALUES ($1, $2, $3)
`;

const createPayment = `
    INSERT INTO payments (
        work_log_id,
        total_payment,
        total_paid,
        balance,
        status
    )
    VALUES ($1, $2, 0, $2, 'PENDING')
    RETURNING *
`;

const getWorklog = `
    SELECT 
        wl.id,
        d.department_name,
        p.product_name,
        wl.items_produced,
        pay.total_payment
        wl.work_date,

        MAX(
            CASE
                WHEN wa.work_type = 'WORKER'
                THEN e.first_name || ' ' || e.last_name
            END
        ) AS worker,

        MAX (
            CASE
                WHEN wa.work_type = 'CARVING'
                THEN e.first_name || ' ' || e.last_name
            END
        ) AS carving_person,

        MAX (
            CASE
                WHEN wa.work_type = 'TURNING'
                THEN e.first_name || ' ' || e.last_name
            END
        ) AS turning_person

        FROM work_logs wl

        JOIN departments d
        ON wl.department_id = d.id

        JOIN products p
        ON wl.product_id = p.id

        LEFT JOIN work_assignments wa
        ON wl.id = wa.work_log_id

        LEFT JOIN employee_details e
        ON wa.employee_id = e.id

        LEFT JOIN payments pay
        ON wl.id = pay.work_log_id

        WHERE wl.id = $1 AND wl.deleted_at IS NULL
        GROUP BY 
            wl.id,
            d.department_name,
            p.product_name,
            wl.items_produced,
            wl.work_date
            pay.total_payment 
`;

const getWorklogs = `
    SELECT 
        wl.id,
        d.department_name,
        p.product_name,
        wl.items_produced,
        pay.total_payment,
        wl.work_date,

        MAX (
            CASE
                WHEN wa.work_type = 'WORKER'
                THEN e.first_name || ' ' || e.last_name
            END
        ) AS worker,

        MAX (
            CASE
                WHEN wa.work_type = 'CARVING'
                THEN e.first_name || ' ' || e.last_name
            END
        ) AS carving_person,

        MAX (
            CASE
                WHEN wa.work_type = 'TURNING'
                THEN e.first_name || ' ' || e.last_name
            END
        ) AS turning_person

    FROM worklogs wl

    JOIN departments d
    ON wl.department_id = d.id

    JOIN products p
    ON wl.product_id = p.id

    LEFT JOIN work_assignments wa
    ON wl.id = wa.work_log_id

    LEFT JOIN employee_details e
    ON wa.employee_id = e.id

    LEFT JOIN payments pay
    ON wl.id = pay.work_log_id

    WHERE wl.deleted_at IS NULL AND (p.product_name ILIKE $1 OR d.department_name ILIKE $1)

    GROUP BY
        wl.id,
        d.department_name,
        p.product_name,
        wl.items_produced,
        pay.total_payment,
        wl.work_date

    ORDER BY wl.work_date DESC
    LIMIT $2 OFFSET $3
`;

const updateWorkLog = (fields, index) => `
    UPDATE work_logs
    SET ${fields.join(", ")}
    WHERE id = $${index}
    AND deleted_at IS NULL
    RETURNING *
`;

const updatePayment = `
    UPDATE payments
    SET total_payment = $1,
        balance = $1,
    WHERE work_log_id = $2
`;

const deleteAssignments = `
    DELETE FROM work_assignments 
    WHERE work_log_id = $1
`;

const deleteWorkLog = `
    UPDATE work_logs
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING *
`;

module.exports = {
  createWorkLog,
  createAssignment,
  createPayment,
  getWorklog,
  getWorklogs,
  updatePayment,
  updateWorkLog,
  deleteAssignments,
  deleteWorkLog,
};
