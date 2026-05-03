import axios from "axios"
import router from "@/router"

const api = axios.create({
  baseURL: "http://localhost:8081"
})

/**
 * 🔐 REQUEST INTERCEPTOR
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  // 🚨 NÃO enviar token no login
  const isLoginRequest = config.url?.includes("/usuario/login")

  if (token && !isLoginRequest) {
    config.headers.Authorization = token
  }

  return config
})

/**
 * 🚨 RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem("token")

      if (router.currentRoute.value.path !== "/") {
        router.push("/")
      }
    }

    return Promise.reject(error)
  }
)

export default api