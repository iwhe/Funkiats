import express from "express";
const router = express.Router();
import { authentication, isAuthenticated } from "../auth/authentication.js";
import callback from "../auth/callback.js";

router.route("/authenticate").get(authentication);
router.route("/isAuthenticated").get(isAuthenticated);
router.route("/callback").get(callback);

export default router;
