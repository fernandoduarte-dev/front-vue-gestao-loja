<template>
  <AppLayout titulo="Produtos">

    <!-- 🔍 FILTROS -->
    <div class="container mb-4">

      <div class="row justify-content-center mb-3 g-2">

        <!-- Nome -->
        <div class="col-md-3">
          <input
            v-model="filtroNome"
            class="form-control text-center"
            placeholder="Tipo"
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

      <!-- BOTÕES -->
      <div class="row justify-content-center gap-2">

        <div class="col-auto">
          <button class="btn btn-primary" @click="consultar">
            Consultar
          </button>
        </div>

        <div class="col-auto">
          <router-link to="/produtos/novo" class="btn btn-success">
            Novo Produto
          </router-link>
        </div>

      </div>
    </div>

    <!-- 📋 TABELA -->
    <div v-if="produtos.length" class="container">

      <table class="table table-striped text-center align-middle">

        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Tecido</th>
            <th>Cor</th>
            
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in produtos" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.nome }}</td>
            <td>{{ p.tecido }}</td>
            <td>{{ p.cor }}</td>
            
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
import api from "@/services/api"
import LoadingStore from "@/store/loading"

export default {
  name: "ProdutosPage",
  components: { AppLayout },

  data() {
    return {
      produtos: [],
      filtroNome: "",
      filtroTecido: "",
      filtroCor: "",
      carregado: false
    }
  },

  methods: {

    // 🔹 CONSULTAR PRODUTOS
    async consultar() {
      LoadingStore.show()

      try {
        const { data } = await api.get("/produto/buscar", {
          params: {
            nome: this.filtroNome || null,
            tecido: this.filtroTecido || null,
            cor: this.filtroCor || null
          }
        })

        this.produtos = data
        this.carregado = true

      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
        this.produtos = []
        this.carregado = true

      } finally {
        LoadingStore.hide()
      }
    }

  }
}
</script>