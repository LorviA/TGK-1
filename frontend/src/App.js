import LoginPage from './pages/LoginPage.js';
import MainPage from './pages/MainPage.js'
import HistoryPage from './pages/HistoryPage.js'
import CreateUserPage from './pages/CreateUserPage.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage.js'
import ProtectedRoute from './pages/ProtectedRoute.js'
import BannedUserPage from './pages/BannedUserPage.js'

function App() {
  return (
     <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/banned" element={
          <ProtectedRoute requiredRole={4} inverseProtection>
            <BannedUserPage />
          </ProtectedRoute>
        } />

         <Route path="/createUser" element={
          <ProtectedRoute requiredRole={1}>
            <CreateUserPage />
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute requiredRole={1}>
            <HistoryPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
