// pages/EmployeeList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { employeeService } from '../services/employee';
import { departmentService } from '../services/department';

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  useEffect(() => { applyFilters(); }, [searchTerm, departmentFilter, statusFilter, employees]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, deptData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      // Handle paginated response { data: [], totalCount: n }
      const empList = empData.data || empData || [];
      setEmployees(empList);
      setFiltered(empList);
      setDepartments(deptData || []);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...employees];
    if (searchTerm) {
      result = result.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (departmentFilter) {
      result = result.filter(emp => String(emp.departmentId) === String(departmentFilter));
    }
    if (statusFilter) {
      result = result.filter(emp => emp.status === statusFilter);
    }
    setFiltered(result);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeService.delete(id);
      const updated = employees.filter(emp => emp.employeeId !== id);
      setEmployees(updated);
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await employeeService.updateStatus(id, newStatus);
      setEmployees(employees.map(emp =>
        emp.employeeId === id ? { ...emp, status: newStatus } : emp
      ));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <Loading message="Loading employees..." />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Employees</h1>
              <p className="text-gray-500 mt-1">{filtered.length} of {employees.length} employees</p>
            </div>
            <Button variant="success" onClick={() => navigate('/add-employee')}>
              ➕ Add Employee
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between">
              <p className="text-red-700">{error}</p>
              <button onClick={() => setError('')} className="text-red-500 text-sm underline">Dismiss</button>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Search by Name or Email"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                label="Filter by Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                options={departments.map(d => ({ id: d.departmentId, name: d.name }))}
              />
              <Select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { id: 'Active', name: 'Active' },
                  { id: 'Inactive', name: 'Inactive' },
                  { id: 'OnLeave', name: 'On Leave' }
                ]}
              />
            </div>
          </Card>

          {/* Table */}
          <Card>
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">👥</div>
                <p className="text-gray-500 text-lg">No employees found</p>
                <Button variant="primary" onClick={() => navigate('/add-employee')} className="mt-4">
                  Add First Employee
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Position</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Salary</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((emp) => (
                      <tr key={emp.employeeId} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                              {emp.firstName?.[0]}{emp.lastName?.[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{emp.firstName} {emp.lastName}</p>
                              <p className="text-xs text-gray-400">{emp.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">{emp.email}</td>
                        <td className="px-4 py-4 text-gray-600 text-sm">
                          {emp.department?.name || departments.find(d => d.departmentId === emp.departmentId)?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">{emp.position || 'N/A'}</td>
                        <td className="px-4 py-4 text-gray-600 text-sm">
                          ₹{(emp.salary || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={emp.status}
                            onChange={(e) => handleStatusChange(emp.employeeId, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium focus:outline-none cursor-pointer border-0 ${
                              emp.status === 'Active' ? 'bg-green-100 text-green-800' :
                              emp.status === 'OnLeave' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="Active">● Active</option>
                            <option value="Inactive">● Inactive</option>
                            <option value="OnLeave">● On Leave</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/edit-employee/${emp.employeeId}`)}
                              className="text-xs px-3 py-1"
                            >
                              ✏️ Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(emp.employeeId)}
                              className="text-xs px-3 py-1"
                            >
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};