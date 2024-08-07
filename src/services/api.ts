import axios from "axios";

const api = axios.create({
    baseURL: "https://smartfin-backend.onrender.com"
})

export default api