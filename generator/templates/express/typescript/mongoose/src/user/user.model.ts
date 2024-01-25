import { Document, model } from 'mongoose';
import { userSchema } from './user.schema';
import { IUser } from './interfaces';

const User = model<IUser>('users', userSchema);

export default User;