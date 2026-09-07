import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <section className="profile-panel panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Current user</p>
          <h1>Profile details</h1>
        </div>
      </div>
      <div className="profile-grid">
        <div>
          <span className="label">Full name</span>
          <strong>{user?.fullName || '-'}</strong>
        </div>
        <div>
          <span className="label">Username</span>
          <strong>{user?.username || '-'}</strong>
        </div>
        <div>
          <span className="label">Email</span>
          <strong>{user?.email || '-'}</strong>
        </div>
        <div>
          <span className="label">Phone</span>
          <strong>{user?.phone || '-'}</strong>
        </div>
        <div>
          <span className="label">Department</span>
          <strong>{user?.department || '-'}</strong>
        </div>
        <div>
          <span className="label">Role</span>
          <strong>{user?.role || '-'}</strong>
        </div>
      </div>
    </section>
  );
}