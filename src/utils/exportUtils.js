// Export utilities for Project Progress & Task Status Reports (No financials)

export function exportProjectsToCSV(projects, tasks) {
  const headers = [
    'Project ID',
    'Project Name',
    'Type',
    'Location',
    'Status',
    'Progress (%)',
    'Start Date',
    'End Date',
    'Manager',
    'Total Tasks',
    'Completed Tasks'
  ];

  const rows = projects.map(proj => {
    const projTasks = tasks.filter(t => t.projectId === proj.id);
    const completedTasks = projTasks.filter(t => t.status === 'Completed').length;
    return [
      `"${proj.id}"`,
      `"${proj.name.replace(/"/g, '""')}"`,
      `"${proj.type || ''}"`,
      `"${(proj.location || '').replace(/"/g, '""')}"`,
      `"${proj.status}"`,
      proj.progress,
      `"${proj.startDate}"`,
      `"${proj.endDate}"`,
      `"${proj.manager}"`,
      projTasks.length,
      completedTasks
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SITEFLOW_Project_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTasksToCSV(tasks, projects) {
  const headers = [
    'Task ID',
    'Task Name',
    'Project Name',
    'Status',
    'Priority',
    'Progress (%)',
    'Start Date',
    'Due Date',
    'Blocker Reason'
  ];

  const rows = tasks.map(t => {
    const proj = projects.find(p => p.id === t.projectId);
    return [
      `"${t.id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${proj ? proj.name.replace(/"/g, '""') : t.projectName || ''}"`,
      `"${t.status}"`,
      `"${t.priority}"`,
      t.progress || 0,
      `"${t.startDate || ''}"`,
      `"${t.dueDate || ''}"`,
      `"${(t.blockerReason || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SITEFLOW_Task_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
