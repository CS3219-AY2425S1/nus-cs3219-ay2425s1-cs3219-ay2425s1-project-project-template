// Modify the axios instance to point to the backend server.
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});
