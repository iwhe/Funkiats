import axios from "axios";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;


const callback = asyncHandler(async (req, res) => {
  console.log("Callback::", req.query);
  const code = req.query.code;
  let state = req.query.state;
  // Add this at the start of the handler:
  if (state) {
    state = decodeURIComponent(state).replace(/;/g, '');
  }

  if (!code) {
    throw new ApiError(400, "Missing authorization code");
  }

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: new URLSearchParams({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  try {
    const response = await axios.post(authOptions.url, authOptions.form, {
      headers: authOptions.headers,
    }).catch(error => {
      console.error("Error from Spotify API:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    });

    const access_token = response.data.access_token;
    const token_type = response.data.token_type;
    const expires_in = response.data.expires_in;
    const refresh_token = response.data.refresh_token;
    const scope = response.data.scope;

    const options = {
      httpOnly: true,    // JS cannot read it
      secure: true,      // HTTPS only
      sameSite: "none",  // allow cross-site requests
      // path: "/",
      domain: process.env.NODE_ENV === "production" ? process.env.FRONTEND_HOSTNAME : "localhost"
    };

    console.log("Options::", options);
    res
      .status(200)
      .cookie("access_token", access_token, options)
      .cookie("token_type", token_type, options)
      .cookie("expires_in", expires_in, options)
      .cookie("refresh_token", refresh_token, options)
      .cookie("scope", scope, options)

    console.log("Cookies set. Now redirecting to:", process.env.FRONTEND_URL + "/suggestion");
    res.redirect(process.env.FRONTEND_URL + "/suggestion");

  } catch (error) {
    console.error("Error in callback route:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    throw new ApiError(500, "Failed to get access token", error);
  }
});

export default callback;
