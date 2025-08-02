// lib/serverApi.ts
import axios from "axios";

const serverApi = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://estate-backend-4hk1.onrender.com/api/v1"
      : "http://localhost:5000/api/v1",
});

export default serverApi;
