import { http } from "./http.js";
export const getPlaylistDetail = async (id) => {
    try {
        const response = await http.get(`/playlist/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPlaylist = async (params) => {  // params should be an object
    try {
        const response = await http.get(`/playlist/keyword`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}