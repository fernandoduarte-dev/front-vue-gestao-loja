<template>
  <AppLayout titulo="Usuários">

    <!-- 🔍 FILTRO + AÇÕES LADO A LADO -->
    <div class="d-flex flex-column align-items-center mb-4">

      <!-- INPUT -->
      <div class="col-md-4 mb-3">
        <input
          v-model="filtroNome"
          class="form-control text-center"
          placeholder="Buscar por nome"
        />
      </div>

      <!-- BOTÕES -->
      <div class="d-flex gap-2 justify-content-center">

        <button class="btn btn-primary" @click="buscarUsuarios">
          Consultar
        </button>

        <router-link to="/usuarios/novo" class="btn btn-success">
          Novo Usuário
        </router-link>

      </div>

    </div>

    <!-- 📋 TABELA -->
    <div v-if="usuariosFiltrados.length">

      <table class="table table-striped text-center align-middle">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in usuariosFiltrados" :key="u.id">
            <td>{{ u.nome }}</td>
            <td>{{ u.email }}</td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- ⚠️ VAZIO -->
    <p v-else-if="carregado" class="text-center text-muted">
      Nenhum usuário encontrado
    </p>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import axios from "axios";
import LoadingStore from '@/store/loading'



export default {
  name: "UsuariosPage",
  components: { AppLayout },

  data() {
    return {
      usuarios: [],
      filtroNome: "",
      carregado: false
    }
  },

  computed: {
    usuariosFiltrados() {
      if (!this.filtroNome) return this.usuarios

      return this.usuarios.filter(u =>
        u.nome.toLowerCase().includes(this.filtroNome.toLowerCase())
      )
    }
  },

  methods: {
  async buscarUsuarios() {
    LoadingStore.show()

    try {
      const token = localStorage.getItem("token")

      const res = await axios.get("http://localhost:8081/usuario/nome", {
        params: {
          nome: this.filtroNome
        },
        headers: {
          Authorization: token
        }
      })

      this.usuarios = res.data
      this.carregado = true

    } catch (error) {
      console.error(error)
      this.carregado = false
    } finally {
      LoadingStore.hide()
    }
  }
 }
}
</script>