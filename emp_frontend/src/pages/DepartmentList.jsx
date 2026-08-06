// pages/DepartmentList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { departmentService } from '../services/department';

export const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchDepartments(); }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(departments);
    } else {
      setFiltered(departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, departments]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAll();
      setDepartments(data || []);
      setFiltered(data || []);
    } catch (err) {
      setError('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentService.delete(id);
      const updated = departments.filter(d => d.departmentId !== id);
      setDepartments(updated);
    } catch (err) {
      setError('Failed to delete department. It may have employees assigned.');
    }
  };

  if (loading) return <Loading message="Loading departments..." />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Departments</h1>
              <p className="text-gray-500 mt-1">{departments.length} departments total</p>
            </div>
            <Button variant="success" onClick={() => navigate('/add-department')}>
              ➕ Add Department
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
              <button onClick={() => setError('')} className="text-red-500 text-sm underline mt-1">Dismiss</button>
            </div>
          )}

          {/* Search */}
          <Card className="mb-6">
            <Input
              label="Search Departments"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Card>

          {/* Table */}
          <Card>
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🏢</div>
                <p className="text-gray-500 text-lg">No departments found</p>
                <Button variant="primary" onClick={() => navigate('/add-department')} className="mt-4">
                  Add First Department
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employees</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((dept, index) => (
                      <tr key={dept.departmentId} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 text-sm">{index + 1}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-800">{dept.name}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                          {dept.description || <span className="text-gray-400 italic">No description</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            dept.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {dept.isActive ? '● Active' : '● Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {dept.employees?.length || 0} employees
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/edit-department/${dept.departmentId}`)}
                              className="text-xs px-3 py-1"
                            >
                              ✏️ Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(dept.departmentId)}
                              className="text-xs px-3 py-1"
                            >
                              🗑️ Delete
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