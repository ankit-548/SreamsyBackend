import mongoose from 'mongoose';

const videoesSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }, 
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }, 
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    },
    
}, { timestamps: true });

export const Video = mongoose.model('Video', videoesSchema);
