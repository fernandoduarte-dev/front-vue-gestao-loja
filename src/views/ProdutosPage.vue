<template>
  <AppLayout titulo="Produtos">

    <!-- 🔍 FILTROS -->
    <div class="container mb-4">
      <div class="row justify-content-center mb-3">

       <!-- Nome -->
        <div class="col-md-3">
          <input
            v-model="filtroNome"
            class="form-control text-center"
            placeholder="Nome"
          />
        </div>
       
        <!-- Tecido -->
        <div class="col-md-3">
          <input
            v-model="filtroTecido"
            class="form-control text-center"
            placeholder="Tecido"
          />
        </div>


        <!-- Cor -->
        <div class="col-md-3">
          <input
            v-model="filtroCor"
            class="form-control text-center"
            placeholder="Cor"
          />
        </div>

       

      </div>

      <!-- Botões -->
      <div class="row justify-content-center gap-2">
        <div class="col-auto">
          <button class="btn btn-primary w-100" @click="consultar">
            Consultar
          </button>
        </div>

        <div class="col-auto">
          <router-link to="/produtos/novo" class="btn btn-success w-100">
            Novo Produto
          </router-link>
        </div>
      </div>
    </div>

    <!-- 📋 TABELA -->
    <div v-if="produtos.length">
      <table class="table table-striped text-center align-middle">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tecido</th>
            <th>Cor</th>
            <th>Venda</th>
            <th>Locação</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in produtos" :key="p.id">
            <td>{{ p.nome }}</td>
            <td>{{ p.tecido }}</td>
            <td>{{ p.cor }}</td>
            <td>R$ {{ p.valorVenda }}</td>
            <td>R$ {{ p.valorLocacao }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="carregado" class="text-center text-muted">
      Nenhum produto encontrado
    </p>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import axios from "axios"
import LoadingStore from "@/store/loading"

export default {
  name: "ProdutosPage",
  components: { AppLayout },

  data() {
    return {
      produtos: [],
      filtroTecido: "",
      filtroCor: "",
      carregado: false
    }
  },

  methods: {
    async consultar() {
      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        const res = await axios.get("http://localhost:8081/produto/buscar", {
          params: {
            tecido: this.filtroTecido || null,
            cor: this.filtroCor || null
          },
          headers: { Authorization: token }
        })

        this.produtos = res.data
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