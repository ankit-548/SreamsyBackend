import mongoose from 'mongoose';
import { DB_NAME } from './constants';
import express from 'express';

const app = express();

try {
    (async() => {
        await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
        //DB is connected but express app has some error
        app.on('error', (error) => {
            console.log('ERROR: ', error);
            throw(error);
        })

        app.listen(process.env.PORT, () => {
            console.log(`App listening on port: ${process.env.PORT}`)
        })
    }
    )();

} catch(error) {
    console.error('ERROR: ', error);
    throw error;
}