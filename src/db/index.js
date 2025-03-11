import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
        console.log(connectionInstance.connection.host, "DB connected successfully");       
        // console.log(connectionInstance.connection.host, connectionInstance);       

    } catch(error) {
        console.log("ERROR connecting mongodb", error);
        process.exit(1);
    }
}

export default connectDb;