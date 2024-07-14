import axios from "axios";

const api = axios.create({
    baseURL: "https://smartfin-api.vercel.app"
})

export default api