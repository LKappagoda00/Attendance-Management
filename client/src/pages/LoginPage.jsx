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
      <div className="auth-card hero-card">
        <p className="eyebrow">Secure access</p>
        <h1>Attendance system login</h1>
        <p>Use role-aware sign in for Admin, HR, or Employee. First login can require a password change.</p>
        <div className="feature-list">
          <span>Role-based access</span>
          <span>First-login password reset</span>
          <span>Direct login</span>
        </div>
      </div>

      <form className="auth-card form-card" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <label>
          Username
          <input
            required
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            placeholder="Admin, HR, or employee username"
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Password"
          />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="employee">Employee</option>
          </select>
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Continue'}
        </button>
        <p className="helper-text">Default admin seed: admin / Admin@00</p>
      </form>
    </section>
  );
}