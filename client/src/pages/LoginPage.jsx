import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  username: '',
  password: '',
  role: 'employee',
};

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', {
        username: form.username,
        password: form.password,
        role: form.role,
      });

      signIn({ authToken: data.token, authUser: data.user });
      navigate(data.requiresPasswordChange ? '/change-password' : '/dashboard');
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="hero-panel">
        <div className="brand-row auth-brand-row">
          <span className="brand-icon">🗓</span>
          <span>ShiftLedger</span>
        </div>

        <div className="clock-wrap" aria-hidden="true">
          <div className="clock-face">
            <span className="clock-tick tick-1" />
            <span className="clock-tick tick-2" />
            <span className="clock-tick tick-3" />
            <span className="clock-tick tick-4" />
            <span className="clock-tick tick-5" />
            <span className="clock-tick tick-6" />
            <span className="clock-tick tick-7" />
            <span className="clock-tick tick-8" />
            <span className="clock-tick tick-9" />
            <span className="clock-tick tick-10" />
            <span className="clock-tick tick-11" />
            <span className="clock-tick tick-12" />
            <span className="clock-hand short-hand" />
            <span className="clock-hand long-hand" />
          </div>
        </div>

        <h1>
          Every hour,
          <br />
          accounted for.
        </h1>

        <p>
          Employees log their own check-in and check-out. Hours, overtime, and salary are worked out
          automatically — no more Excel sheets over WhatsApp.
        </p>

        <div className="hero-footnote">Prototype build — for internal demonstration only.</div>
      </div>

      <div className="form-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="subheading">Sign in to record or review attendance.</p>

          <label>
            <span>Username</span>
            <input
              required
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              placeholder="admin"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="••••••••"
            />
          </label>

          <label>
            <span>Role</span>
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="employee">Employee</option>
            </select>
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>

          <div className="demo-box">
            <strong>Demo accounts</strong>
            <p>
              Admin — admin@company.lk / admin123
              <br />
              Employee — navodya@company.lk / demo123
            </p>
          </div>

          <p className="helper-text">Prototype notice: this demo stores data unencrypted and visible to anyone</p>
        </form>
      </div>
    </section>
  );
}