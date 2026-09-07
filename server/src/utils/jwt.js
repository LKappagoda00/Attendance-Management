import jwt from 'jsonwebtoken';

export function signAuthToken(user, secret) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
    },
    secret,
    { expiresIn: '8h' },
  );
}

export function signTempToken(user, secret) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      purpose: 'otp-challenge',
    },
    secret,
    { expiresIn: '10m' },
  );
}