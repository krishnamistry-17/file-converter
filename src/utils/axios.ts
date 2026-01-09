import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(BASE_URL);

const api = axios.create({
  baseURL: "",
});

export default api;
