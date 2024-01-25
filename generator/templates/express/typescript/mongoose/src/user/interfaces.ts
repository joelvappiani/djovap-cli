export interface IUser extends Document {
    username: string,
    password: string
}

export interface UpdateBody {
    username?: string,
    password?: string
}

export interface CreateBody {
    username: string,
    password: string
}