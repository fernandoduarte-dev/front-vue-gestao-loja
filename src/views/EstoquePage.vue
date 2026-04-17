<template>
  <AppLayout titulo="Estoque">

    <!-- 🔍 FILTROS -->
    <div class="container mb-4">
      <div class="row justify-content-center mb-3">

        <!-- SKU -->
        <div class="col-md-3">
          <input
            v-model="filtroSku"
            class="form-control text-center"
            placeholder="SKU"
          />
        </div>

        <!-- Tamanho -->
        <div class="col-md-3">
          <select v-model="filtroTamanho" class="form-control text-center">
            <option value="">Tamanho</option>
            <option v-for="t in tamanhos" :key="t">{{ t }}</option>
          </select>
        </div>

      </div>

      <!-- BOTÕES -->
      <div class="row justify-content-center gap-2">
        <div class="col-auto">
          <button class="btn btn-primary w-100" @click="consultar">
            Consultar
          </button>
        </div>

        <div class="col-auto">
          <router-link to="/estoque/movimento" class="btn btn-success w-100">
            Entrada/Saída
          </router-link>
        </div>
      </div>
    </div>

    <!-- 📋 TABELA -->
    <div v-if="estoques.length" class="container">
      <table class="table table-striped text-center align-middle">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Tecido</th>
            <th>Cor</th>
            <th>Tamanho</th>
            <th>Saldo</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="e in estoques" :key="e.id">
            <td>{{ e.produtoNome }}</td>
            <td>{{ e.produtoTecido }}</td>
            <td>{{ e.produtoCor }}</td>
            <td>{{ e.tamanho }}</td>
            <td>{{ e.saldo }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="carregado" class="text-center text-muted">
      Nenhum registro encontrado
    </p>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import axios from "axios"
import LoadingStore from "@/store/loading"

export default {
  name: "EstoquePage",
  components: { AppLayout },

  data() {
    return {
      estoques: [],
      filtroSku: "",
      filtroTamanho: "",
      carregado: false,

      tamanhos: ["PP", "P", "M", "G", "GG"]
    }
  },

  methods: {
    async consultar() {
      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        const res = await axios.get("http://localhost:8081/estoque/saldos", {
          params: {
            sku: this.filtroSku || null,
            tamanho: this.filtroTamanho || null
          },
          headers: { Authorization: token }
        })

        this.estoques = res.data
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

