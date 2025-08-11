import {http} from "./http.js";

export const protectedRoute = async () => {
    try {
        const response = await http.get("/auth/isAuthenticated");
        return response.data;
    } catch (error) {
        throw error;
    }
}