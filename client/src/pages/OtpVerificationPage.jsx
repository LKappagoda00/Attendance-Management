import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function OtpVerificationPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn, otpChallenge, clearOtpChallenge } = useAuth();

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/verify-otp', {
        challengeId: otpChallenge?.challengeId,
        code,
      });

      signIn({ authToken: data.token, authUser: data.user });
      clearOtpChallenge();
      if (data.requiresPasswordChange) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page narrow-page">
      <form className="auth-card form-card" onSubmit={handleVerify}>
        <p className="eyebrow">Two-step verification</p>
        <h1>Enter OTP</h1>
        <p className="helper-text">The code was sent to your selected email or phone channel.</p>
        <label>
          Verification code
          <input value={code} onChange={(event) => setCode(event.target.value)} required inputMode="numeric" />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <p className="helper-text">Signed in user: {otpChallenge?.challengeUser?.username || 'pending'}</p>
      </form>
    </section>
  );
}