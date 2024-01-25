import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import homeRouter from './home/home.route'
import userRouter from './user/user.route'
import { errorHandler, routeNotFound } from './middlewares';
import { mongooseConnection } from './config';

const app = express()

mongooseConnection()

app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', homeRouter)
app.use('/users', userRouter)

app.use('*', routeNotFound)
app.use(errorHandler)

export default app