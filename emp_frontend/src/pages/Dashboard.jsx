// pages/Dashboard.jsx
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { employeeService } from '../services/employee';
import { departmentService } from '../services/department';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalEmployees: 0, totalDepartments: 0, activeEmployees: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [employeesData, departmentsData, activeData] = await Promise.all([
        employeeService.getAll(1, 1),
        departmentService.getAll(),
        employeeService.getActive()
      ]);
      setStats({
        totalEmployees: employeesData.totalCount || 0,
        totalDepartments: Array.isArray(departmentsData) ? departmentsData.length : 0,
        activeEmployees: Array.isArray(activeData) ? activeData.length : 0
      });
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome back, {user?.name || user?.username}! 👋
            </h1>
            <p className="text-gray-500 mt-2">Here's what's happening in your organization</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center border-l-4 border-blue-500">
              <div className="text-5xl mb-3">👥</div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Employees</p>
              <p className="text-4xl font-bold text-blue-600 mt-1">{stats.totalEmployees}</p>
            </Card>
            <Card className="text-center border-l-4 border-purple-500">
              <div className="text-5xl mb-3">🏢</div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Departments</p>
              <p className="text-4xl font-bold text-purple-600 mt-1">{stats.totalDepartments}</p>
            </Card>
            <Card className="text-center border-l-4 border-green-500">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Active Employees</p>
              <p className="text-4xl font-bold text-green-600 mt-1">{stats.activeEmployees}</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="primary" onClick={() => navigate('/employees')} className="w-full">
                👥 View Employees
              </Button>
              <Button variant="success" onClick={() => navigate('/add-employee')} className="w-full">
                ➕ Add Employee
              </Button>
              <Button variant="outline" onClick={() => navigate('/departments')} className="w-full">
                🏢 View Departments
              </Button>
              <Button variant="warning" onClick={() => navigate('/add-department')} className="w-full">
                ➕ Add Department
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </>
  );
};