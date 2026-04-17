<template>
  <AppLayout titulo="Clientes">

    <!-- 🔍 FILTROS -->
    <div class="container mb-4">
      <div class="row justify-content-center mb-3">
        <!-- Nome -->
        <div class="col-md-4">
          <input
            v-model="filtroNome"
            class="form-control text-center"
            placeholder="Buscar por nome"
          />
        </div>

        <!-- CPF -->
        <div class="col-md-4">
          <input
            v-model="filtroCpf"
            class="form-control text-center"
            placeholder="Buscar por CPF"
          />
        </div>
      </div>

      <!-- Botão único -->
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
              <span v-for="t in c.telefones" :key="t.id">
                ({{ t.ddd }}) {{ t.numero }}<br>
              </span>
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
import axios from "axios"
import LoadingStore from "@/store/loading"

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
    const token = localStorage.getItem("token")
    let res

    if (this.filtroNome) {
      res = await axios.get("http://localhost:8081/cliente/nome", {
        params: { nome: this.filtroNome },
        headers: { Authorization: token }
      })
    } else if (this.filtroCpf) {
      res = await axios.get("http://localhost:8081/cliente/cpf", {
        params: { cpf: this.filtroCpf },
        headers: { Authorization: token }
      })
    } else {
      // 🔑 aqui está o detalhe: consulta com nome vazio
      res = await axios.get("http://localhost:8081/cliente/nome", {
        params: { nome: "" },
        headers: { Authorization: token }
      })
    }

    this.clientes = Array.isArray(res.data) ? res.data : [res.data]
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
