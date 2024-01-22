import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const User = mongoose.model('users', userSchema);

export default User