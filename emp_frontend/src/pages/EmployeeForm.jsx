// pages/EmployeeForm.jsx
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

export const EmployeeForm = ({ isEdit = false, initialData = null }) => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});

  // All fields matching your Employee model exactly
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    salary: '',
    hireDate: '',
    dateOfBirth: '',
    status: 'Active',
    departmentId: ''
  });

  useEffect(() => {
    fetchDepartments();
    if (isEdit && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        position: initialData.position || '',
        salary: initialData.salary || '',
        hireDate: initialData.hireDate ? initialData.hireDate.split('T')[0] : '',
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
        status: initialData.status || 'Active',
        departmentId: initialData.departmentId || ''
      });
    }
  }, [isEdit, initialData]);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data || []);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';
    if (formData.salary && isNaN(formData.salary)) newErrors.salary = 'Salary must be a number';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setFormError('');

    // Build payload matching backend model
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      salary: parseFloat(formData.salary),
      hireDate: formData.hireDate,
      dateOfBirth: formData.dateOfBirth,
      status: formData.status,
      departmentId: parseInt(formData.departmentId)
    };

    try {
      if (isEdit && initialData) {
        await employeeService.update(initialData.employeeId, payload);
      } else {
        await employeeService.create(payload);
      }
      navigate('/employees');
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Failed to save employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button onClick={() => navigate('/employees')} className="hover:text-blue-600 transition-colors">
              Employees
            </button>
            <span>›</span>
            <span className="text-gray-800 font-medium">{isEdit ? 'Edit Employee' : 'Add Employee'}</span>
          </div>

          <Card title={isEdit ? '✏️ Edit Employee' : '➕ Add New Employee'}>
            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">❌ {formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Input label="First Name" type="text" name="firstName"
                  placeholder="John" value={formData.firstName}
                  onChange={handleChange} error={errors.firstName} required />

                <Input label="Last Name" type="text" name="lastName"
                  placeholder="Doe" value={formData.lastName}
                  onChange={handleChange} error={errors.lastName} required />

                <Input label="Email" type="email" name="email"
                  placeholder="john@company.com" value={formData.email}
                  onChange={handleChange} error={errors.email} required />

                <Input label="Phone" type="tel" name="phone"
                  placeholder="+91 9876543210" value={formData.phone}
                  onChange={handleChange} />

                <Select
                  label="Department"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  options={departments.map(d => ({ id: d.departmentId, name: d.name }))}
                  error={errors.departmentId}
                  required
                />

                <Input label="Position" type="text" name="position"
                  placeholder="Senior Developer" value={formData.position}
                  onChange={handleChange} />

                <Input label="Salary (₹)" type="number" name="salary"
                  placeholder="75000" value={formData.salary}
                  onChange={handleChange} error={errors.salary} required />

                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { id: 'Active', name: 'Active' },
                    { id: 'Inactive', name: 'Inactive' },
                    { id: 'OnLeave', name: 'On Leave' }
                  ]}
                />

                <Input label="Hire Date" type="date" name="hireDate"
                  value={formData.hireDate} onChange={handleChange}
                  error={errors.hireDate} required />

                <Input label="Date of Birth" type="date" name="dateOfBirth"
                  value={formData.dateOfBirth} onChange={handleChange}
                  error={errors.dateOfBirth} required />
              </div>

              <div className="flex gap-4 mt-6">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : isEdit ? '💾 Update Employee' : '➕ Add Employee'}
                </Button>
                <Button type="button" variant="secondary"
                  onClick={() => navigate('/employees')} disabled={loading}>
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