const worklogDto = (worklog) => {
  return {
    id: worklog.id,
    department: worklog.department_name,
    worker: worklog.worker || null,
    carving_person: worklog.carving_person || null,
    turning_person: worklog.turning_person || null,
    product_name: worklog.product_name,
    items_produced: worklog.items_produced,
    total_payment: Number(worklog.total_payment) || 0,
    work_date: worklog.work_date,
  };
};

module.exports = worklogDto;
