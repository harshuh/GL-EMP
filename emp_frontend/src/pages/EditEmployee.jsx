// pages/EditEmployee.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EmployeeForm } from './EmployeeForm';
import { Loading } from '../components/Loading';
import { employeeService } from '../services/employee';

export const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchEmployee(); }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getById(id);
      setEmployee(data);
    } catch (err) {
      setError('Employee not found');
      setTimeout(() => navigate('/employees'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading employee..." />;
  if (error) return (
    <div className="text-center mt-16">
      <p className="text-red-600 text-lg">{error}</p>
      <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
    </div>
  );

  return <EmployeeForm isEdit={true} initialData={employee} />;
};