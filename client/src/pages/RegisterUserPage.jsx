import { useState } from 'react';
import api from '../api/client';

const initialForm = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  role: 'employee',
  department: '',
  password: '',
};

export default function RegisterUserPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');

    try {
      const { data } = await api.post('/auth/register', form);
      setStatus(`Created ${data.user.role} account with temporary password ${data.temporaryPassword}`);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Admin only</p>
          <h1>Register HR or employee</h1>
        </div>
      </div>

      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
        </label>
        <label>
          Username
          <input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="hr">HR</option>
            <option value="employee">Employee</option>
          </select>
        </label>
        <label>
          Department
          <input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
        </label>
        <label>
          Temporary password
          <input required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        <div className="grid-actions">
          <button className="button button-primary" type="submit">
            Create user
          </button>
        </div>
      </form>
      {status ? <p className="success-text">{status}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}