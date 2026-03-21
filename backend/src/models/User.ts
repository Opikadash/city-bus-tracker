
import { Schema, model, models, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password: string;
  name: string;
  favorites: string[];  // stop IDs
  tickets: string[];  // ticket IDs
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  favorites: [{ type: String }],
  tickets: [{ type: String, ref: 'Ticket' }]
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  (this as IUser).password = await bcrypt.hash((this as IUser).password, salt);
  next();
});

const User = models.User || model<IUser>('User', userSchema);

export default User as Model<IUser>;

