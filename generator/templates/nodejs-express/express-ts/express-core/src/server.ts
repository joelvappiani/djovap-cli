import app from './app';
import { envConfig } from './config';

const { NODE_ENV, PORT } = envConfig

app.listen(PORT, () => {
    console.log(`NODE_ENV=${NODE_ENV}`)
    console.log(`Server connected on port ${PORT}`)
})