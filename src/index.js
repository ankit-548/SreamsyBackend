import mongoose from 'mongoose';
import { DB_NAME } from './constants';
import express from 'express';

const app = express();

try {
    (async() => {
        await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
        app.on()
    }
    )();

} catch(error) {
    console.error('ERROR: ', error);
    throw error;
}