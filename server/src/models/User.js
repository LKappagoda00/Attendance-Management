import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'hr', 'employee'], required: true },
    department: { type: String, default: '' },
    forcePasswordChange: { type: Boolean, default: true },
    firstLoginCompleted: { type: Boolean, default: false },
    otpCode: { type: String, default: '' },
    otpExpiresAt: { type: Date },
    otpDeliveryMethod: { type: String, enum: ['email', 'phone'], default: 'email' },
    lastLoginAt: { type: Date },
    lastPasswordChangedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const user = this.toObject();

  delete user.passwordHash;
  delete user.otpCode;
  delete user.otpExpiresAt;

  return user;
};

userSchema.statics.hashPassword = async function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

export default mongoose.model('User', userSchema);