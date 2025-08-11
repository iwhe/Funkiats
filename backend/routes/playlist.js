import express from "express";
const router = express.Router();
import { getPlaylist, getPlaylistById, getPlaylistByKeyword } from "../playlist/playlist.js";
// import authCheck from "../middleware/auth_check.js";

router.route("/search").get(getPlaylist);
router.route("/keyword").get(getPlaylistByKeyword);
router.route("/:id").get(getPlaylistById);

export default router;
