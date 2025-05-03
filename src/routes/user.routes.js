import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { uplode } from "../middlewares/multer.midleware.js"

const router = new Router()
router.route("/register").post(
    uplode.fields([
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

export default router