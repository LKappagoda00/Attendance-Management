import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Attendance Management</p>
          <h1>Access Control</h1>
        </div>
        <nav className="nav-links">
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
          <NavLink to="/profile">Profile</NavLink>
          {user?.role === 'admin' ? <NavLink to="/register">Register Users</NavLink> : null}
        </nav>
        <button className="button button-ghost" onClick={handleLogout} type="button">
          Sign out
        </button>
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Signed in as</p>
            <strong>{user?.fullName || user?.username || 'Guest'}</strong>
          </div>
          <Link className="button" to="/change-password">
            Change password
          </Link>
        </header>
        <Outlet />
      </main>
    </div>
  );
}