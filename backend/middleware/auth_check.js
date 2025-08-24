// import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";

const authCheck = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(' ')[1];
    if (!token) throw new ApiError(401, "Unauthorized: No token provided");

    try {
        // Verify the JWT token
        const decoded = verifyToken(token);
        // Attach user to request object
        req.user = decoded;
        console.log("User::", req.user);
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        throw new ApiError(401, "Unauthorized: Invalid token");
    }
};

export default authCheck;
