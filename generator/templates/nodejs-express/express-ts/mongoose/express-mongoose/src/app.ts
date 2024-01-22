import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import homeRouter from './home/home.route'
import { notFound } from './middlewares';

const app = express()


app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', homeRouter)
console.log(process.env.NODE_ENV)
app.use(notFound)


export default app