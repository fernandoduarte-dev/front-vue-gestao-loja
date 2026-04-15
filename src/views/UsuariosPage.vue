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

      <table class="table table-striped">
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
    buscarUsuarios() {
      this.usuarios = [
        { id: 1, nome: "Fernando", email: "teste@email.com" },
        { id: 2, nome: "Maria", email: "maria@email.com" },
        { id: 3, nome: "João", email: "joao@email.com" }
      ]

      this.carregado = true
    }
  }
}
</script>