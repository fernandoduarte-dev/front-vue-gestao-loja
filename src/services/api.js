// src/services/api.js
import axios from "axios"
import router from "@/router"

const api = axios.create({
  baseURL: "http://localhost:8081"
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = token
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      router.push("/")
    }
    return Promise.reject(error)
  }
)

export default api