import { Router } from "express";
import { rejisterUser } from "../controllers/user.controller.js";

const router= new Router()
router.route("/rejister").post(rejisterUser)

export  default router