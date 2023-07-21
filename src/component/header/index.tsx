import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchAllAdmins,
  logoutAdmin,
  selectAdmins,
} from '../../store/adminSlice';
import { fetchAllContents, selectContents } from '../../store/contentSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAdmin = useSelector((state: any) => state.admin.currentAdmin);
  const isSuperAdmin = useSelector((state: any) => state.admin.isSuperAdmin);
  const allContents = useSelector(selectContents);
  const allAdmins = useSelector(selectAdmins);

  const handleLogout = () => {
    dispatch(logoutAdmin() as any);
    navigate('/login');
  };

  const prepareContents = () => {
    if (allContents.length === 0) dispatch(fetchAllContents() as any);
    navigate('/content');
  };

  const prepareAdmins = () => {
    if (allAdmins.length === 0) dispatch(fetchAllAdmins() as any);
    navigate('/admin');
  };

  return (
    currentAdmin && (
      <header>
        <Link to={'/'}>
          <img src="" alt="Kavach logo" />
        </Link>
        <nav>
          <button onClick={prepareContents}>
            <img src="" alt="Content" />
            <p>Content</p>
          </button>
          {isSuperAdmin && (
            <button onClick={prepareAdmins}>
              <img src="" alt="Admin" />
              <p>Admin</p>
            </button>
          )}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
    )
  );
}

export default Header;
