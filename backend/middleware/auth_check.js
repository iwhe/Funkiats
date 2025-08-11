// import ApiError from "../utils/ApiError.js";

const authCheck = (req, res) => {
    const access_token = req?.cookies?.access_token;

    console.log("Cookies::", req?.cookies);
    console.log("Access Token::", access_token);

    if (!access_token) {
        console.log("User is not authenticated....");
        return false;
        // return res.status(401).json(new ApiError(401, "User is not authenticated"));
        // throw new ApiError(401, 'Authentication required');
    }
    console.log("User is authenticated");
    return true;
};
export default authCheck;
