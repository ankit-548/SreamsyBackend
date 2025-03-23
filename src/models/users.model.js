import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    watchHistory: [
        {   
            type: mongoose.Schema.ObjectId,
            ref: 'Video'
        }
    ],
    refreshToken: {
        type: String, 
        required: true
    } 

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);