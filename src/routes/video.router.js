import { Router } from "express";
import { jwtVerify } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadVideo, } from '../controllers/videoes.controller.js'


const router = Router();

router.route('/upload').post(
    jwtVerify, 
    upload.fields([
        {
            name: 'thumbnail',
            maxCount: 1,
        },
        {
            name: 'videoFile',
            maxCount: 1
        }
    ]),
    uploadVideo
)


export default router;