import { Video } from "../models/videoes.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const uploadVideo = asyncHandler(async (req, res) => {
    //1. get form data from body
    const {title, description, isPublished,} = req.body;
    //2. apply validation
     if([title, isPublished].some((field) => {
        field?.trim() === ''
     })) {
        throw new ApiError(400, "Title and isPublished is required")
     }
    //3. check thumbnail and videoFile
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    const videoLocalPath = req.files?.videoFile[0]?.path;

    if(!thumbnailLocalPath ||  !videoLocalPath) {
        throw new ApiError(400, "thumbnail and videoFile are required");
    }
    //4. upload thumbnail and videoFile on cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log('thumbnail: ', thumbnail)
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    console.log('videoFile: ', videoFile)

    if(!thumbnail.url || !videoFile.url) {
        throw new ApiError(400, "thumbnail and videoFile are required");
    }
    //5. create 
    const video = await Video.create({
        title,
        description,
        duration: videoFile?.duration ?? 0,
        isPublished,
        owner: req.user._id,
        thumbnail: thumbnail?.url,
        videoFile: videoFile?.url
    })

    //6. check video upload successful
    const isUploaded = await Video.findById(video._id)

    if(!isUploaded) {
        throw new ApiError(400, 'Video was not uploaded')
    }

    return res.status(201).json(
        new ApiResponse(200, 'Video uploaded successfully')
    )
})

// const updateViews

// const publishVideo


export {
    uploadVideo,
}