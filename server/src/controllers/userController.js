import User from '../models/User.js';

export async function listUsers(request, response) {
  const filter = request.user.role === 'hr' ? { role: 'employee' } : {};
  const users = await User.find(filter).sort({ createdAt: -1 });

  return response.json({ users: users.map((user) => user.toSafeJSON()) });
}