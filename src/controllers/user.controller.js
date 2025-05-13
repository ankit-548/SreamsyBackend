import { Aggregate } from "mongoose";
import { upload } from "../middleware/multer.middleware.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'

// const registerUser = asyncHandler(async (req, res) => {
//     res.status(200).json({
//         message: "Ok"
//     })
// })
async function generateAccessAndRefreshToken(userId) {
    try {        
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "There is some issue in generating tokens", [error])
    }
}
const registerUser = asyncHandler(async (req, res) => {
    // GET user details from frontend
    const {userName, email, fullName, password} = req.body;
    // validation - not empty
    if([userName, email, fullName, password].some((field) => 
        {
            field?.trim() === ""
        })
    ){
        throw new ApiError(400, 'All fields are required');        
    }
    // check if user already exist - userName or email
    const existedUser = await User.findOne({ 
        $or:[{userName}, {email}]
    })
    if(existedUser) {
        throw new ApiError(400, 'User already registered')
    }
    // check for images, check for avatar
    const avatarLocalpath = req.files?.avatar[0]?.path;
    const coverImgaeLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalpath) {
        throw new ApiError(400, "Avatar file is required");
    }    

    // upload them to cloudinary, avatar 
    const avatar = await uploadOnCloudinary(avatarLocalpath);
    const coverImage = await uploadOnCloudinary(coverImgaeLocalPath);
    if(!avatar.url) {
        throw new ApiError(400, 'Avatar file is required');
    }
    // create user object - create entry in db
    const user = await User.create({
        fullName,
        userName : userName.toLowerCase(),
        email,
        password, 
        avatar : avatar.url,
        coverImage : coverImage?.url
    });
    
    // remove password and refresh token field from reference
    const createdUser = await User.findById(user._id).select(
        
    );
    // check for user creation 
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong user not registered");
    }
    // return res

    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", createdUser)
    )
});

const loginUser = asyncHandler(async (req, res) => {
    // get user data
    const {userName, password, email} = req.body;
    // validate email/username and password not empty
    if((!userName && !email) || !password) {
        throw new ApiError(400, "userName/email and password are required")
    }
    // find user for this email or username 
    const user = await User.findOne({
        $or: [{userName}, {email}]
    })
    // match the password bcrypt
    if(! await user.isCorrectPassword(password)) {
        throw new ApiError(400, "Please enter correct password");
    }
    // generate accessToken and refreshToken
    // set user data in req.body.user
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
    // response with cookies
    const options = {
        httpOnly: true,
        secured: true
    }

    res.status(201)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200, 'User logged in successfully', { accessToken, refreshToken }
        )
    )
});

const logOutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        $unset: { refreshToken: "" }
    },
    {
      new: true  
    });

    const options = {
        httpOnly: true,
        secured: true
    }

    return res.status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
        new ApiResponse(201, "User Logged out successfully", {updatedUser})
    )
});

const accessRefreshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req?.cookies.refreshToken || req?.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new ApiError(400, 'refreshToken expired', [error])
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    try {
    
        const user = await User.findById(decodedToken._id)
    
        if(!user) {
            throw new ApiError(400, 'invalid refreshToken', [error])
        }
        
        if(incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(400, 'refreshToken expired or used', [error])
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    
        const options = {
            httpOnly: true,
            secure: true
        }
        res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(201, 'accessToken and refreshToken generated successfully', {
                accessToken,
                refreshToken
            })
        )
    } catch (error) {
        throw new ApiError(400, 'access token not generated', [error])
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {currentPassword, newPassword}  = req.body;

    if(!newPassword || !currentPassword) {
        throw new ApiError(400, 'new password and current password are required', [error])
    }

    const user =  await User.findById(req.user._id);   

    const passwordMatched = await user.isCorrectPassword(currentPassword)

    if(!passwordMatched) {
        throw new ApiError(400, "current password doesn't match")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res.status(200)
    .json(
        new ApiResponse(
            201,
            'Password updated successfully',
            {}
        )
    )
})

const getCurrentUser = asyncHandler( async (req, res) => {
    return res.status(200)
    .json(
        new ApiResponse(201, "User details found", res.user)
    )
})

const updateUserDetail = asyncHandler( async (req, res) => {
    const {userName, email} = req.body;

    if(!userName || !email) {
        throw new ApiError(400, 'userName and email are required', [error])
    }

    const user = User.findByIdAndUpdate(
        res.user._id,
        {
            $set: {
                userName, // we can write both way
                email: email
            }
        }
    ).select('-password')

    return res.status(200)
    .json(new ApiResponse(201, 'Details updated succefully', user))

})

const updateUserAvatar = asyncHandler( async (req, res) => {
    const avatarPath = req?.file.path

    if(!avatarPath) {
        throw new ApiError(400, 'avatar file is missing', [error])
    }

    const avatar = await uploadOnCloudinary(avatarPath)

    if(!avatar) {
        throw new ApiError(400, 'avatar file is required', [error])
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select('-password')

    return res.status(200)
    .json( new ApiResponse(201, 'avatar update succssfully', user))
    
})
const updateUserCoverImage = asyncHandler( async (req, res) => {
    const coverImagePath = req?.file.path

    if(!coverImagePath) {
        throw new ApiError(400, 'coverImage file is missing', [error])
    }

    const coverImage = await uploadOnCloudinary(coverImagePath)

    if(!coverImage) {
        throw new ApiError(400, 'coverImage file is required', [error])
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select('-password')

    return res.status(200)
    .json( new ApiResponse(201, 'coverImage update succssfully', user))
    
})

const getUserChannelDetails = asyncHandler( async (req, res) => {
    const userName = req.params;

    if(!userName?.trim()) {
        throw new ApiError(400, 'userName is required', [error]);
    }

    const channel = User.aggregate([
        {
            $match: {userName: "$userName?.toLowerCase()"}
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: subscriptions,
                localField: _id,
                foreignField: channel,
                as: subscribedTo
            }
        },
        {
            $addFields:{
                totalSubscribers: {
                   $size: subscribers 
                },
                totalChannelSubscribedTO: {
                    $size: subscribedTo
                }
            }
        },
        {
            $project: {
                userName,
                fullName,
                email,
                totalSubscribers,
                totalChannelSubscribedTO,
                avatar,
                coverImage
            }
        },
    ])

    if(!channel) {
        throw new ApiError(400, "userName is not valid", [error])
    }

    return res.status(200)
    .json( new ApiResponse(201, "user details found successfully", channel[0]))

})


export {
    registerUser, 
    loginUser, 
    logOutUser, 
    accessRefreshToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelDetails
}