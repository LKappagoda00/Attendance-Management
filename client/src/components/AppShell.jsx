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
        <div className="sidebar-top">
          <div className="brand-row">
            <span className="brand-icon">◫</span>
            <span className="brand-name">ShiftLedger</span>
          </div>
          <nav className="nav-links">
            <NavLink to="/dashboard" end>
              Overview
            </NavLink>
            <NavLink to="/profile">Employees</NavLink>
            {user?.role === 'admin' ? <NavLink to="/register">Payroll</NavLink> : null}
            <NavLink to="/change-password">Settings</NavLink>
          </nav>
        </div>

        <div className="sidebar-user">
          <div className="user-badge">{(user?.fullName || user?.username || 'Admin').charAt(0).toUpperCase()}</div>
          <div className="user-meta">
            <strong>{user?.fullName || user?.username || 'Admin User'}</strong>
            <span>{user?.email || 'admin@company.lk'}</span>
          </div>
          <button className="button button-ghost text-button" onClick={handleLogout} type="button">
            Log out
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div className="topbar-title-block">
            <p className="eyebrow">Company overview</p>
            <h1>Attendance and payroll across the whole team.</h1>
          </div>
          <div className="topbar-pill">2026-09</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}