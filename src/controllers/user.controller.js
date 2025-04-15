import { User } from "../models/users.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// const registerUser = asyncHandler(async (req, res) => {
//     res.status(200).json({
//         message: "Ok"
//     })
// })
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
    // validate email/username and password not empty
    // find user for this email or username 
    // match the password bcrypt
    // generate accessToken and refreshToken
    // update user with refreshToken
    // set user data in req.body.user
    // response with cookies
});

export {registerUser, loginUser}