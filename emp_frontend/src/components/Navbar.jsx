// components/Navbar.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">
            <h1
              className="text-2xl font-bold text-white cursor-pointer hover:text-blue-200 transition-colors"
              onClick={() => navigate('/dashboard')}
            >
            Employee Manager
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-white text-sm">
                  Welcome, <strong>{user.username}</strong>
                </span>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  className="text-sm px-3 py-1"
                >
                  Logout
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};