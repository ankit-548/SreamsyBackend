// 1. Approach 1 - direct approach - writing connection code directly in index.js


// import mongoose from 'mongoose';
// import { DB_NAME } from './constants';
// import express from 'express';

// const app = express();

// try {
//     (async() => {
//         await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
//         //DB is connected but express app has some error
//         app.on('error', (error) => {
//             console.log('ERROR: ', error);
//             throw(error);
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App listening on port: ${process.env.PORT}`)
//         })
//     }
//     )();

// } catch(error) {
//     console.error('ERROR: ', error);
//     throw error;
// }



// 2. Approach 2 - using separate file for connection code

import connectDb from './db/index.js';
// require('dotenv').config({path: './env'});  this will also work well but not consistent at other places we are using import statemnent
import dotenv from 'dotenv';

dotenv.config({path: './env'});
connectDb()
.then(() => {
    app.on("ERROR", (error) => {
        console.log("ERROR while connecting to app: ", error);
        process.exit(1);
    });
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Connected to server on PORT ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("ERROR CONNECTING DB: ", error)
});