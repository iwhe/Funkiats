import express from "express";
const router = express.Router();
import { authentication, isAuthenticated } from "../auth/authentication.js";
import authCheck from "../middleware/auth_check.js";
import callback from "../auth/callback.js";

router.route("/authenticate").get(authentication);
router.route("/isAuthenticated").get(authCheck, isAuthenticated);
router.route("/callback").get(callback);

export default router;
