import queryString from "query-string";
import authCheck from "../middleware/auth_check.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
];
// const auth_Check = authCheck();

const authentication = asyncHandler(async (req, res) => {
  console.log("Initiating Spotify OAuth flow...");  // Debug log
  // Replace the state line with:
  const state = (req.query.state || 'none');

  try {
    const authUrl = "https://accounts.spotify.com/authorize?" + queryString.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scopes.join(" "),
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true  // Force showing the Spotify dialog
    });
    console.log("Redirecting to:", authUrl);  // Debug log
    res.redirect(authUrl);
  } catch (error) {
    console.error("Auth error:", error);
    throw error;
  }
});

const renewToken = async (refresh_token) => {
  console.log("Refresh Token::", refresh_token);
  if (!refresh_token) {
    console.log("pls provide refresh token to renew your access");
  }

  const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  });

  const data = await response.json();
  console.log("RenewedData::", data);
  return data;
};

const isAuthenticated = async (req, res, next) => {
  try {
    // const isAuth = authCheck(req, res);
    // console.log("Is Auth::", isAuth);
    const token = req?.user;
    console.log("Cookies::", token);
    if (!token) {
      return res.status(401)
        .json(new ApiError(401, "Unauthorized: No valid token provided"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "User is authenticated"));
  } catch (error) {
    console.error('Authentication error:', error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error during authentication", error));
  }
};

export { authentication, renewToken, isAuthenticated };
