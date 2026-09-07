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
    <section className="dashboard-board">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">{dashboard.title}</p>
          <h2>{dashboard.description}</h2>
        </div>
        <div className="date-pill">2026-09</div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">Employees</span>
          <strong className="metric-value">3</strong>
        </article>
        <article className="metric-card">
          <span className="metric-label">Total hours</span>
          <strong className="metric-value accent-value">48.0h</strong>
        </article>
        <article className="metric-card">
          <span className="metric-label">Total overtime</span>
          <strong className="metric-value muted-value">0.0h</strong>
        </article>
        <article className="metric-card">
          <span className="metric-label">Payroll cost</span>
          <strong className="metric-value payroll-value">Rs. 105,000</strong>
        </article>
      </div>

      <div className="bar-panel">
        <div className="bar-panel-header">Hours worked by employee</div>
        <div className="bar-list">
          <div className="bar-row">
            <span>Navodya Manamend...</span>
            <div className="bar-track"><div className="bar-fill fill-48" /></div>
            <strong>48.0h</strong>
          </div>
          <div className="bar-row">
            <span>Kasun Perera</span>
            <div className="bar-track"><div className="bar-fill fill-0" /></div>
            <strong>0.0h</strong>
          </div>
          <div className="bar-row">
            <span>Dilani Fernando</span>
            <div className="bar-track"><div className="bar-fill fill-0" /></div>
            <strong>0.0h</strong>
          </div>
        </div>
      </div>
    </section>
  );
}