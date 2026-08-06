// pages/DepartmentForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { departmentService } from '../services/department';

export const DepartmentForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    if (isEdit && id) fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      setFetchLoading(true);
      const data = await departmentService.getById(id);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        isActive: data.isActive ?? true
      });
    } catch (err) {
      setFormError('Failed to load department');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Department name is required';
    if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setFormError('');
    try {
      if (isEdit) {
        await departmentService.update(id, formData);
      } else {
        await departmentService.create(formData);
      }
      navigate('/departments');
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Failed to save department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Loading message="Loading department..." />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button onClick={() => navigate('/departments')} className="hover:text-blue-600 transition-colors">
              Departments
            </button>
            <span>›</span>
            <span className="text-gray-800 font-medium">{isEdit ? 'Edit Department' : 'Add Department'}</span>
          </div>

          <Card title={isEdit ? '✏️ Edit Department' : '➕ Add New Department'}>
            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">❌ {formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Department Name"
                  type="text"
                  name="name"
                  placeholder="e.g. Engineering, HR, Finance"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief description of the department..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Department is Active
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : isEdit ? '💾 Update Department' : '➕ Create Department'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/departments')} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};