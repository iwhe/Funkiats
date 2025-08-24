import express from "express";
const router = express.Router();
import { getPlaylist, getPlaylistById, getPlaylistByKeyword } from "../playlist/playlist.js";
import authCheck from "../middleware/auth_check.js";

router.route("/search").get(authCheck, getPlaylist);
router.route("/keyword").get(authCheck, getPlaylistByKeyword);
router.route("/:id").get(authCheck, getPlaylistById);

export default router;
