// pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');
    setErrors({});

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">👔</div>
          <h2 className="text-3xl font-bold text-gray-800">Employee Manager</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">❌ {submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setErrors({ ...errors, username: '' }); setSubmitError(''); }}
            error={errors.username}
            disabled={isLoading}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); setSubmitError(''); }}
            error={errors.password}
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Logging in...</>
            ) : 'Login'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">Demo Credentials</p>
          <p className="text-xs text-gray-600">👤 admin / harsh1010</p>
          <p className="text-xs text-gray-600">👤 hr / hr123</p>
        </div>
      </Card>
    </div>
  );
};