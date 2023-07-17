import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../store/adminSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAdmin = useSelector((state: any) => state.admin.currentAdmin);
  const isSuperAdmin = useSelector((state: any) => state.admin.isSuperAdmin);

  const handleLogout = () => {
    dispatch(logoutAdmin() as any);
    navigate('/login');
  };

  return (
    currentAdmin && (
      <header>
        <Link to={'/'}>
          <img src="" alt="Kavach logo" />
        </Link>
        <nav>
          <NavLink to="/content">
            <img src="" alt="Content" />
            <p>Content</p>
          </NavLink>
          {isSuperAdmin && (
            <NavLink to="/admin">
              <img src="" alt="Admin" />
              <p>Admin</p>
            </NavLink>
          )}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
    )
  );
}

export default Header;
