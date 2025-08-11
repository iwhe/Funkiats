import axios from "axios";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;


const callback = asyncHandler(async (req, res) => {
  console.log("Callback::", req.query);
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    console.error("No code parameter in callback");
    throw new ApiError(400, "Missing authorization code");
  }
  console.log("Code::", code);

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
    });

    const access_token = response.data.access_token;
    const token_type = response.data.token_type;
    const expires_in = response.data.expires_in;
    const refresh_token = response.data.refresh_token;
    const scope = response.data.scope;

    const options = {
      httpOnly: false,
      secure: false,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    };

    console.log("Access Token::", access_token);
    res
      .status(200)
      .cookie("access_token", access_token)
      .cookie("token_type", token_type)
      .cookie("expires_in", expires_in)
      .cookie("refresh_token", refresh_token)
      .cookie("scope", scope)

    console.log("Redirecting to suggestion page...");
    res.redirect("http://localhost:5173/suggestion");

  } catch (error) {
    console.error("Error while retrieving tokens.", error);
    throw new ApiError(500, "Failed to get access token", error);
  }
});

export default callback;
