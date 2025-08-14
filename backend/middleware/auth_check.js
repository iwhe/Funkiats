// import ApiError from "../utils/ApiError.js";

const authCheck = (req, res) => {
    const access_token = req?.cookies?.access_token;

    if (!access_token) {
        return false;
    }
    console.log("User is authenticated");
    return true;
};
export default authCheck;
