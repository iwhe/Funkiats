import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:7000/api",
  withCredentials: true,
});

// export default http;
