import User from './user.model';
import { CreateBody, IUser, UpdateBody } from './interfaces';

export const showAll = async () => {
    const users = await User.find()
    return users
}

export const createUser = async (body: CreateBody): Promise<unknown | IUser> => {
    const newUser = new User(body)
    const result = newUser.save()
    return result
}

export const updateUser = async (id: string, body: UpdateBody): Promise<unknown | IUser> => {
    const result = await User.findByIdAndUpdate(id, body, { new: true })
    return result
}

export const deleteUser = async (id: string): Promise<unknown | IUser> => {
    const result = await User.findByIdAndDelete(id)
    return result
}