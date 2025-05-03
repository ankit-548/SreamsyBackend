import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Here we are authenticating user if he is authenticated give access of user
try {
    var jwtVerify = asyncHandler(async (req, res, next) => {
        const accessToken = req?.cookies.accessToken || req?.header('Authorization').replace('');
        if(!accessToken) {
            return new ApiError(400, 'AccessToken not found')
        }
        const user = User.findById(accessToken._id);
        if(!user) {
            return new ApiError(400, 'User not fount')
        }
        req.user = user;
        next();
    })
} catch (error) {
    throw new ApiError(400, 'unauthorized request')
}

export {jwtVerify} ;