import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    channel: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export const Subscription = mongoose.model('subscription', subscriptionSchema)

 