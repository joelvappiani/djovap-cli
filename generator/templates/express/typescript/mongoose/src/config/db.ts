import mongoose from 'mongoose';
import { InternalServerError } from '../utils/errors';

export const mongooseConnection = async () => {

    const connectionString = process.env.DB_CONNECTION_STRING
    // If no connection string in .env throw error
    if (!connectionString) throw new InternalServerError({ message: 'Connection string to DB missing' })

    try {
        //Connect to mongoDB
        await mongoose.connect(connectionString)
        console.log('MongoDB database connected')
    } catch (err: any) {
        throw new InternalServerError(err)
    }
}