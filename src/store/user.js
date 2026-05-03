import { defineStore } from "pinia"
import axios from "axios"

export const useUserStore = defineStore("user", {
  state: () => ({
    usuario: null
  }),

  actions: {
    async carregarUsuario() {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          this.usuario = null
          return
        }

        const response = await axios.get(
          "http://localhost:8081/usuario/me",
          {
            headers: {
              Authorization: token
            }
          }
        )

        this.usuario = response.data

      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
        this.usuario = null
      }
    }
  }
})