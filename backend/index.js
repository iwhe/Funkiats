import express from "express";
import cookieParser from "cookie-parser";
const router = express.Router();
const app = express();

import cors from "cors";
import "dotenv/config";
import authRoute from "./routes/auth.js";
import playlistRoute from "./routes/playlist.js";

app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_2],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));




app.use(express.static("public"));

app.use("/api/auth", authRoute);
app.use("/api/playlist", playlistRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
