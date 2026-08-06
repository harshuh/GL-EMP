// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { Loading } from "./components/Loading";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { EmployeeList } from "./pages/EmployeeList";
import { EmployeeForm } from "./pages/EmployeeForm";
import { EditEmployee } from "./pages/EditEmployee";
import { DepartmentList } from "./pages/DepartmentList";
import { DepartmentForm } from "./pages/DepartmentForm";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <Loading message="Checking authentication..." />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <Loading message="Loading..." />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-employee"
        element={
          <ProtectedRoute>
            <EmployeeForm isEdit={false} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-employee/:id"
        element={
          <ProtectedRoute>
            <EditEmployee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <DepartmentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-department"
        element={
          <ProtectedRoute>
            <DepartmentForm isEdit={false} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-department/:id"
        element={
          <ProtectedRoute>
            <DepartmentForm isEdit={true} />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
