<template>
  <AppLayout titulo="Clientes">

    <!-- 🔍 FILTROS -->
    <div class="container mb-4">
      <div class="row justify-content-center mb-3">

        <div class="col-md-4">
          <input
            v-model="filtroNome"
            class="form-control text-center"
            placeholder="Buscar por nome"
          />
        </div>

        <div class="col-md-4">
          <input
            v-model="filtroCpf"
            class="form-control text-center"
            placeholder="Buscar por CPF"
          />
        </div>

      </div>

      <div class="row justify-content-center gap-2">
        <div class="col-auto">
          <button class="btn btn-primary w-100" @click="consultar">
            Consultar
          </button>
        </div>

        <div class="col-auto">
          <router-link to="/clientes/novo" class="btn btn-success w-100">
            Novo Cliente
          </router-link>
        </div>
      </div>
    </div>

    <!-- 📋 TABELA -->
    <div v-if="clientes.length">
      <table class="table table-striped text-center align-middle">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Telefone(s)</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="c in clientes" :key="c.id">
            <td>{{ c.nome }}</td>
            <td>{{ c.cpf }}</td>
            <td>{{ c.email }}</td>
            <td>
              <div v-for="t in c.telefones" :key="t.id">
                ({{ t.ddd }}) {{ t.numero }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="carregado" class="text-center text-muted">
      Nenhum cliente encontrado
    </p>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import LoadingStore from "@/store/loading"
import api from "@/services/api"

export default {
  name: "ClientesPage",
  components: { AppLayout },

  data() {
    return {
      clientes: [],
      filtroNome: "",
      filtroCpf: "",
      carregado: false
    }
  },

  methods: {

    async consultar() {
      LoadingStore.show()

      try {
        let res
        const params = {}

        if (this.filtroNome) {
          params.nome = this.filtroNome
          res = await api.get("/cliente/nome", { params })

        } else if (this.filtroCpf) {
          params.cpf = this.filtroCpf
          res = await api.get("/cliente/cpf", { params })

        } else {
          params.nome = ""
          res = await api.get("/cliente/nome", { params })
        }

        this.clientes = Array.isArray(res.data)
          ? res.data
          : [res.data]

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