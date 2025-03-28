import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
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

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// isCorrectPassword is a property we are creating in methods 
userSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function() {
    return jsonwebtoken.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    },
    process.env.JWT_ACCESS_TOKEN,
    {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken = async function() {
    return jsonwebtoken.sign({
        _id : this._id,
    },
    process.env.JWT_REFRESH_TOKEN,
    {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model('User', userSchema);