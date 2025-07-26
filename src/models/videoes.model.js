import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    },
    
}, { timestamps: true });
videoesSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoesSchema);
