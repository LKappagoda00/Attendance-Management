import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import User from './models/User.js';

dotenv.config();

async function seedAdmin() {
  await connectDatabase(process.env.MONGODB_URI);

  const passwordHash = await User.hashPassword('Admin@00');
  await User.findOneAndUpdate(
    { username: 'admin', role: 'admin' },
    {
      fullName: 'System Admin',
      username: 'admin',
      email: 'admin@example.com',
      phone: '',
      role: 'admin',
      department: 'System',
      passwordHash,
      forcePasswordChange: true,
      firstLoginCompleted: false,
      otpCode: '',
      otpExpiresAt: null,
      otpDeliveryMethod: 'email',
      lastLoginAt: null,
      lastPasswordChangedAt: null,
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log('Admin account set to: admin / Admin@00');
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});