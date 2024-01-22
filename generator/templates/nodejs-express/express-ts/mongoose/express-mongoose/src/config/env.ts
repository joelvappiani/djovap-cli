import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.join(__dirname, `../../env/.env.${process.env.NODE_ENV}`)
})

export const envConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT
} 
