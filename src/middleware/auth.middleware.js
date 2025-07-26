import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

// Here we are authenticating user if he is authenticated give access of user
try {
    var jwtVerify = asyncHandler(async (req, res, next) => {
        const accessToken = req?.cookies.accessToken || req?.header('Authorization')?.replace('');
        if(!accessToken) {
            throw new ApiError(400, 'AccessToken not found')
        }
        const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id);
        if(!user) {
            throw new ApiError(400, 'User not found')
        }
        req.user = user;
        next();
    })
} catch (error) {
    throw new ApiError(400, 'unauthorized request')
}

export {jwtVerify} ;