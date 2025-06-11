import { Router } from "express";
import { registerUser, loginUser, logoutUser, refresAccesshToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.midleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
    registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refresAccesshToken)
export default router