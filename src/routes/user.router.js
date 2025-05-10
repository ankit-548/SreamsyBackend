import { Router } from "express";
import { loginUser, logOutUser, registerUser, accessRefreshToken } from "../controllers/user.controller.js";
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

    router.route('/access-token').post(accessRefreshToken)

    // Authorized
    router.route('/logout').post(jwtVerify, logOutUser)

export default router;