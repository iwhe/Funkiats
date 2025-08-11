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
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    // exposedHeaders: ['Set-Cookie']
  })
);


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


// Debug middleware to see what's happening
// app.use((req, res, next) => {
//   if (req.url.includes('/playlist/')) {
//     console.log('=== Playlist Request ===');
//     console.log('Headers:', req.headers.cookie);
//     console.log('Cookies:', req.cookies);
//     console.log('========================');
//   }
//   next();
// });

app.use(express.static("public"));

app.use("/api/auth", authRoute);
app.use("/api/playlist", playlistRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
