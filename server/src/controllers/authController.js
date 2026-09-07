import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtp } from '../services/notificationService.js';
import { generateOtp } from '../utils/otp.js';
import { signAuthToken, signTempToken } from '../utils/jwt.js';

function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

function publicUser(user) {
  return user.toSafeJSON();
}

export async function login(request, response) {
  const { username, password, role } = request.body;

  if (!username || !password || !role) {
    return response.status(400).json({ message: 'Username, password, and role are required' });
  }

  const user = await User.findOne({ username: normalizeUsername(username), role });

  if (!user || !user.isActive) {
    return response.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordValid = await user.comparePassword(password);

  if (!passwordValid) {
    return response.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  return response.json({
    token: signAuthToken(user, process.env.JWT_SECRET),
    requiresPasswordChange: user.forcePasswordChange || !user.firstLoginCompleted,
    user: publicUser(user),
  });
}

export async function verifyOtp(request, response) {
  const { challengeId, code } = request.body;

  if (!challengeId || !code) {
    return response.status(400).json({ message: 'Challenge and code are required' });
  }

  let payload;

  try {
    payload = jwt.verify(challengeId, process.env.JWT_SECRET);
  } catch (error) {
    return response.status(401).json({ message: 'OTP challenge expired' });
  }

  const user = await User.findById(payload.sub);

  if (!user || !user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return response.status(401).json({ message: 'OTP expired or invalid' });
  }

  const otpValid = await bcrypt.compare(code, user.otpCode);

  if (!otpValid) {
    return response.status(401).json({ message: 'Incorrect OTP' });
  }

  user.otpCode = '';
  user.otpExpiresAt = null;
  user.lastLoginAt = new Date();
  await user.save();

  return response.json({
    token: signAuthToken(user, process.env.JWT_SECRET),
    requiresPasswordChange: user.forcePasswordChange || !user.firstLoginCompleted,
    user: publicUser(user),
  });
}

export async function registerUser(request, response) {
  const { fullName, username, email, phone, role, department, password } = request.body;

  if (!fullName || !username || !password || !role) {
    return response.status(400).json({ message: 'Full name, username, password, and role are required' });
  }

  if (!['hr', 'employee','admin'].includes(role)) {
    return response.status(400).json({ message: 'Only HR and employee accounts can be registered here' });
  }

  const existing = await User.findOne({ username: normalizeUsername(username) });

  if (existing) {
    return response.status(409).json({ message: 'Username already exists' });
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    fullName,
    username: normalizeUsername(username),
    email,
    phone,
    role,
    department,
    passwordHash,
    forcePasswordChange: true,
    firstLoginCompleted: false,
    createdBy: request.user?._id || null,
  });

  return response.status(201).json({
    user: publicUser(user),
    temporaryPassword: password,
  });
}

export async function changePassword(request, response) {
  const { currentPassword, newPassword, username } = request.body;

  if (!request.user) {
    return response.status(401).json({ message: 'Authentication required' });
  }

  if (!currentPassword || !newPassword) {
    return response.status(400).json({ message: 'Current and new password are required' });
  }

  const passwordValid = await request.user.comparePassword(currentPassword);

  if (!passwordValid) {
    return response.status(401).json({ message: 'Current password is incorrect' });
  }

  if (username) {
    const existing = await User.findOne({ username: normalizeUsername(username) });

    if (existing && existing._id.toString() !== request.user._id.toString()) {
      return response.status(409).json({ message: 'Username already exists' });
    }
  }

  request.user.passwordHash = await User.hashPassword(newPassword);
  request.user.forcePasswordChange = false;
  request.user.firstLoginCompleted = true;

  if (username) {
    request.user.username = normalizeUsername(username);
  }

  request.user.lastPasswordChangedAt = new Date();
  await request.user.save();

  return response.json({
    user: publicUser(request.user),
  });
}

export async function me(request, response) {
  return response.json({ user: publicUser(request.user) });
}