import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const initialForm = {
  currentPassword: '',
  username: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ChangePasswordPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/change-password', form);
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page narrow-page">
      <form className="auth-card form-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Profile security</p>
        <h1>Change password or username</h1>
        <label>
          Username
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            placeholder="Optional new username"
          />
        </label>
        <label>
          Current password
          <input
            required
            type="password"
            value={form.currentPassword}
            onChange={(event) => setForm({ ...form, currentPassword: event.target.value })}
          />
        </label>
        <label>
          New password
          <input
            required
            type="password"
            value={form.newPassword}
            onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
          />
        </label>
        <label>
          Confirm new password
          <input
            required
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
          />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </section>
  );
}