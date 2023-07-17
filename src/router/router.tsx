import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../component/login';
import NotFound from '../component/error/notFound';
import Content from '../component/content';
import Admin from '../component/admin';

const AppRouter: React.FC = () => {
  const currentAdmin = useSelector((state: any) => state.admin.currentAdmin);
  const isSuperAdmin = useSelector((state: any) => state.admin.isSuperAdmin);

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentAdmin ? (
            <Navigate to="/content" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={currentAdmin ? <Navigate to="/content" replace /> : <Login />}
      />
      <Route
        path="/content"
        element={!currentAdmin ? <Navigate to="/login" replace /> : <Content />}
      />
      {currentAdmin && <Route path="/content" element={<Content />} />}
      {isSuperAdmin && <Route path="/admin" element={<Admin />} />}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
