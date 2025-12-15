export const dummyData = {
  workers: [
    { id: 1, name: 'Eleanor Pena', jobType: 'Designer', salary: 85000, status: 'Active' },
    { id: 2, name: 'Cody Fisher', jobType: 'Developer', salary: 110000, status: 'Active' },
    { id: 3, name: 'Esther Howard', jobType: 'Project Manager', salary: 95000, status: 'Inactive' },
    { id: 4, name: 'Jenny Wilson', jobType: 'Developer', salary: 105000, status: 'Active' },
    { id: 5, name: 'Robert Fox', jobType: 'Designer', salary: 90000, status: 'Inactive' },
  ],
  jobTypes: [
    { id: 1, name: 'Painter', baseSalary: 25.00 },
    { id: 2, name: 'Builder', baseSalary: 35.00 },
    { id: 3, name: 'Electrician', baseSalary: 45.00 },
    { id: 4, name: 'Plumber', baseSalary: 42.00 },
  ],
  salaryTrends: [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 48000 },
    { month: 'Mar', amount: 46500 },
    { month: 'Apr', amount: 51000 },
    { month: 'May', amount: 49800 },
    { month: 'Jun', amount: 52480 },
  ],
  taskStatus: [
    { name: 'Completed', value: 142, color: '#10b981' },
    { name: 'In Progress', value: 58, color: '#f3ae3f' },
    { name: 'Pending', value: 23, color: '#ef4444' },
  ],
  workersByJobType: [
    { jobType: 'Painter', count: 8 },
    { jobType: 'Builder', count: 12 },
    { jobType: 'Electrician', count: 10 },
    { jobType: 'Plumber', count: 6 },
  ],
};