import axios from "axios";
import { asyncHandler } from "../utils/AsyncHandler.js";
import queryString from "query-string";
import { renewToken } from "../auth/authentication.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { analyzeEmotions } from "../utils/MusicParameters.js";

let options = {
  httpOnly: true,    // JS cannot read it
  secure: true,      // HTTPS only
  sameSite: "none",  // allow cross-site requests
  // path: "/",
  // domain: process.env.NODE_ENV === "production" ? process.env.FRONTEND_HOSTNAME : "localhost"
};

const getPlaylist = asyncHandler(async (req, res) => {
  // console.log("cookies", req?.cookies);
  let access_token = req.cookies?.access_token || req.query?.access_token;
  const refresh_token = req.cookies?.refresh_token || req.query?.refresh_token;
  const token_type = req.cookies?.token_type || req.query?.token_type;
  // const search_query = req.query;

  // console.log("Cookies::", req?.cookies);
  // console.log("Query::", req?.query);

  const search_api = "https://api.spotify.com/v1/search";
  const analyzeEmotionsResult = analyzeEmotions(req.query.emotions);
  const emotionsString = analyzeEmotionsResult.query;
  const suggestions = analyzeEmotionsResult.suggestions;
  const typeParam = Array.isArray(JSON.parse(req?.query?.type)) ? JSON.parse(req?.query?.type).join(',') : JSON.parse(req?.query?.type);

  const params = {
    q: emotionsString,
    type: typeParam,
    limit: JSON.parse(req?.query?.limit),
  };

  // console.log("Params::", params);

  const makeQuery = async () => {
    console.log("Make Query");
    const response = await axios.get(
      `${search_api}?${queryString.stringify(params)}`,
      {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      }
    );
    // console.log("Response::", response);
    const data = await response.data;
    // console.log("Unformatted Data::", data);
    let backgroundImage = null;
    if (Array.isArray(data.playlists?.items)) {
      for (let i = data.playlists.items.length - 1; i >= 0; i--) {
        const item = data.playlists.items[i];
        if (item?.images && item?.images?.length > 0) {
          backgroundImage = item.images[0].url;
          break;
        }
      }
    }

    const formattedData = {
      playlistTitle: emotionsString,
      background: backgroundImage,
      suggestions,
      albums: data.albums,
      tracks: data.tracks,
      shows: data.shows,
      href: data.playlists?.href, // Include main href
      next: data.playlists?.next, // Include next page link
      items: data.playlists?.items?.map((item) => ({
        external_urls: {
          spotify: item?.external_urls.spotify,
        },
        href: item?.href,
        id: item?.id,
        images: item?.images,
        name: item?.name,
        uri: item?.uri,
        owner: {
          external_urls: {
            spotify: item?.owner?.external_urls?.spotify,
          },
          id: item?.owner?.id,
          href: item?.owner?.href,
          uri: item?.owner?.uri,
          display_name: item?.owner?.display_name,
        },
      })),
    };
    // Filter out items without an ID and apply limit to the items array
    const validItems = formattedData.items?.filter(item => item?.id) || [];
    const limit = JSON.parse(req?.query?.limit) || 15;
    formattedData.items = validItems.slice(0, limit);

    return formattedData;
  };

  try {
    const data = await makeQuery();
    res.status(200).json(new ApiResponse(200, data, "Success"));
  } catch (error) {
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.error?.message == "The access token expired"
    ) {
      console.log("Access Token expired. Renewing it now.");
      const response = await renewToken(refresh_token);
      // console.log("response::", response);
      access_token = response?.access_token;
      // console.log("access_token after renewal::", access_token);



      // console.log("cookies after renewal::");

      const data = await makeQuery();

      res.cookie("access_token", access_token, options);
      res.status(200).json(new ApiResponse(200, data, "Data retrieved and access token refreshed")); // Then send response

    } else {
      throw new ApiError(500, "Failed to fetch playlists", error);
    }
  }
});

const getPlaylistByKeyword = asyncHandler(async (req, res) => {
  let access_token = req.cookies?.access_token
  const refresh_token = req.cookies?.refresh_token
  const token_type = req.cookies?.token_type

  const search_api = "https://api.spotify.com/v1/search";
  // console.log("Query::", req?.query);
  const emotionsString = req.query.q;
  const params = {
    q: emotionsString, // Remove JSON.stringify since we're already getting a string
    type: JSON.parse(req?.query?.type),
    limit: JSON.parse(req?.query?.limit) * 2,
  };

  // console.log("Params::", params);
  const makeQuery = async () => {

    const response = await axios.get(
      `${search_api}?${queryString.stringify(params)}`,
      {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      }
    );
    const data = await response.data;
    let backgroundImage = null;
    if (Array.isArray(data.playlists?.items)) {
      for (let i = data.playlists.items.length - 1; i >= 0; i--) {
        const item = data.playlists.items[i];
        if (item?.images && item?.images?.length > 0) {
          backgroundImage = item.images[0].url;
          break;
        }
      }
    }
    const formattedData = {
      playlistTitle: emotionsString,
      background: backgroundImage,
      href: data.playlists?.href, // Include main href
      next: data.playlists?.next, // Include next page link
      items: data.playlists?.items?.map((item) => ({
        external_urls: {
          spotify: item?.external_urls.spotify,
        },
        href: item?.href,
        id: item?.id,
        images: item?.images,
        name: item?.name,
        uri: item?.uri,
        owner: {
          external_urls: {
            spotify: item?.owner?.external_urls?.spotify,
          },
          id: item?.owner?.id,
          href: item?.owner?.href,
          uri: item?.owner?.uri,
          display_name: item?.owner?.display_name,
        },
      })),
    };

    const validItems = formattedData.items?.filter(item => item?.id) || [];
    const limit = JSON.parse(req?.query?.limit) || 15;
    formattedData.items = validItems.slice(0, limit);

    return formattedData;
  };

  try {
    const data = await makeQuery();
    res.status(200).json(new ApiResponse(200, data, "Success"));
  } catch (error) {
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.error?.message == "The access token expired"
    ) {
      console.log("Access Token expired. Renewing it now.");
      const response = await renewToken(refresh_token);
      access_token = response?.access_token;
      const data = await makeQuery();

      res.cookie("access_token", access_token, options);
      res.status(200).json(new ApiResponse(200, data, "Data retrieved and access token refreshed")); // Then send response

    } else {
      throw new ApiError(500, "Failed to fetch playlists", error);
    }
  }
});

const formatPlaylist = (playlist) => {
  const formattedPlaylist = {
    name: playlist?.name,
    description: playlist?.description,
    external_urls: playlist?.external_urls,
    type: playlist?.type,
    id: playlist?.id,
    href: playlist?.href,
    image: playlist?.images?.[0]?.url,

    owner: {
      external_urls: {
        spotify: playlist?.owner?.external_urls?.spotify,
      },
      id: playlist?.owner?.id,
      display_name: playlist?.owner?.display_name,
    },

    tracks: {
      total: playlist?.tracks?.total,
      items: playlist?.tracks?.items?.map((item) => {
        const track = item.track; // Access the nested track object
        if (!track) return null; // Skip if no track data

        return {
          id: track.id,
          name: track.name,
          external_urls: {
            spotify: track.external_urls?.spotify,
          },
          uri: track.uri,
          artists: track.artists?.map(artist => ({
            id: artist.id,
            name: artist.name,
            external_urls: {
              spotify: artist.external_urls?.spotify,
            }
          })),
          album: {
            images: track.album?.images,
            name: track.album?.name
          }
        };
      }).filter(Boolean) // Remove any null entries
    }
  };
  return formattedPlaylist;
}


const getPlaylistById = asyncHandler(async (req, res) => {
  let access_token = req.cookies?.access_token
  const refresh_token = req.cookies?.refresh_token
  const token_type = req.cookies?.token_type

  const playlistId = req.params.id;

  const makeQuery = async () => {
    const search_api = "https://api.spotify.com/v1/playlists/";
    const response = await axios.get(
      `${search_api}${playlistId}`,
      {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      }
    );

    const playlist = await response.data;
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    return formatPlaylist(playlist);
  }

  try {
    const playlist = await makeQuery();

    res.status(200).json(new ApiResponse(200, playlist, "Success"));
  } catch (error) {
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.error?.message == "The access token expired"
    ) {
      const response = await renewToken(refresh_token);
      access_token = response?.access_token;

      // const options = {
      //   httpOnly: true,    // JS cannot read it
      //   secure: true,      // HTTPS only
      //   sameSite: "none",  // allow cross-site requests
      //   path: "/",
      // };

      const playlist = await makeQuery();

      res.cookie("access_token", access_token, options);
      res.status(200).json(new ApiResponse(200, playlist, "Data retrieved and access token refreshed")); // Then send response

    } else {
      throw new ApiError(500, "Failed to fetch playlists", error);
    }
  }

});

export { getPlaylist, getPlaylistById, getPlaylistByKeyword };
