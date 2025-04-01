import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async function(localFilePath) {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload('', {
                resource_type: "auto",
            }
        )
        console.log("File is uploaded on Cloudinary", response.url);
        return response;
    } catch(error) {
        fs.unlinkSync(localFilePath);
        console.log('There is an error in uploading file to cloudinary', error);
        return null;        
    }
}

export {uploadOnCloudinary} 