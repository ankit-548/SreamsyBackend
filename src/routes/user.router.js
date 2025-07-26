import { Router } from "express";
import { loginUser, logOutUser, registerUser, generateAccessRefreshToken, getCurrentUser } from "../controllers/user.controller.js";
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

    router.route('/access-token').post(generateAccessRefreshToken)

    // Authorized
    router.route('/logout').post(jwtVerify, logOutUser)
    router.route('/getCurrentUser').get(jwtVerify, getCurrentUser)

export default router;