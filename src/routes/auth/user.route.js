import express from "express";
import * as userCtrl from "../../controllers/auth/user.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/me")
    .get(verifyToken, userCtrl.getUser)
    .patch(verifyToken, userCtrl.updateUser);


export default router;