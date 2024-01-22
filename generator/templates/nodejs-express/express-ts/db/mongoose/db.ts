import mongoose from 'mongoose';

const connectionString = process.env.DB_CONNECTION_STRING
mongoose.connect(connectionString, {

}, () => {
    console.log('Database connected')
})
    .catch(error => {
        console.error(error)
    })