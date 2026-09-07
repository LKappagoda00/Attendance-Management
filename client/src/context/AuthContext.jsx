import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const storedUser = () => {
  const raw = localStorage.getItem('authUser');
  return raw ? JSON.parse(raw) : null;
};

const storedChallenge = () => {
  const raw = localStorage.getItem('otpChallenge');
  return raw ? JSON.parse(raw) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [otpChallenge, setOtpChallenge] = useState(storedChallenge);

  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }

    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }

    if (otpChallenge) {
      localStorage.setItem('otpChallenge', JSON.stringify(otpChallenge));
    } else {
      localStorage.removeItem('otpChallenge');
    }
  }, [otpChallenge, token, user]);

  const signIn = ({ authToken, authUser }) => {
    setToken(authToken);
    setUser(authUser);
  };

  const startOtpChallenge = ({ challengeId, challengeUser }) => {
    setOtpChallenge({ challengeId, challengeUser });
  };

  const clearOtpChallenge = () => {
    setOtpChallenge(null);
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    setOtpChallenge(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, otpChallenge, signIn, signOut, startOtpChallenge, clearOtpChallenge }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}