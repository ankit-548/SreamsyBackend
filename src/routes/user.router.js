import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import { jwtVerify } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser);

    router.route('/login').post(loginUser);

    // Authorized
    router.route('/logout').post(jwtVerify, logOutUser)

export default router;