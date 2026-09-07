import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const dashboards = {
  admin: {
    title: 'Admin dashboard',
    description: 'Manage HR and employee accounts, system settings, and security controls.',
    metrics: ['Employee registration', 'HR registration', 'Password reset control'],
  },
  hr: {
    title: 'HR dashboard',
    description: 'Review employee records and prepare attendance workflows.',
    metrics: ['Employee list', 'Attendance overview', 'Profile controls'],
  },
  employee: {
    title: 'Employee dashboard',
    description: 'View your own profile and update login credentials when needed.',
    metrics: ['My profile', 'Password change', 'OTP verification'],
  },
};

export default function DashboardPage() {
  const { user } = useAuth();

  const dashboard = useMemo(() => dashboards[user?.role] || dashboards.employee, [user]);

  return (
    <section className="panel dashboard-grid">
      <div>
        <p className="eyebrow">Role aware access</p>
        <h1>{dashboard.title}</h1>
        <p className="lead">{dashboard.description}</p>
      </div>
      <div className="metric-grid">
        {dashboard.metrics.map((item) => (
          <article key={item} className="metric-card">
            {item}
          </article>
        ))}
      </div>
      <div className="profile-summary">
        <div>
          <span className="label">Username</span>
          <strong>{user?.username}</strong>
        </div>
        <div>
          <span className="label">Role</span>
          <strong>{user?.role}</strong>
        </div>
        <div>
          <span className="label">Password status</span>
          <strong>{user?.forcePasswordChange ? 'Reset required' : 'Active'}</strong>
        </div>
      </div>
    </section>
  );
}