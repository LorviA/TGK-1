import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null, inverseProtection = false }) => {
  const authData = JSON.parse(localStorage.getItem('auth'));

  // без авторизации редирект на страницу авторизации
  if (!authData) {
    return <Navigate to="/login" replace />;
  }

   if (inverseProtection) {
    if (authData.rights !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  if (authData.rights === 4){
    return <Navigate to="/banned" replace />;
  }


  // доступ по правам иначе редирект на главную
  if (requiredRole && authData.rights !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;