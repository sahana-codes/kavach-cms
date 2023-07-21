import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from '../component/login';
import NotFound from '../component/error/notFound';
import Content from '../component/content';
import Admin from '../component/admin';
import { adminLogin } from '../store/adminSlice';

const AppRouter: React.FC = () => {
  const currentAdmin = useSelector((state: any) => state.admin.currentAdmin);
  const isSuperAdmin = useSelector((state: any) => state.admin.isSuperAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedAdminData = localStorage.getItem('currentAdmin');
    if (storedAdminData) {
      const parsedAdminData = JSON.parse(storedAdminData);
      dispatch(adminLogin(parsedAdminData));
    }
  }, [dispatch]);

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
      {isSuperAdmin && <Route path="/admin" element={<Admin />} />}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
