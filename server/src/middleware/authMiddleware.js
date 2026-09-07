import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication required' });
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      return response.status(401).json({ message: 'Invalid session' });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}