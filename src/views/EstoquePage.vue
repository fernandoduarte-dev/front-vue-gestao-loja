<template>
  <AppLayout titulo="Estoque">

    <!-- 🔍 FILTROS -->
    <div class="container mb-4">

      <div class="row justify-content-center mb-3 g-2">

        <!-- Produto (ID ou SKU futuro) -->
        <div class="col-md-3">
          <input
            v-model="filtroIdProduto"
            class="form-control text-center"
            placeholder="Código Produto"
          />
        </div>

        <!-- Tamanho -->
        <div class="col-md-2">
          <select v-model="filtroTamanho" class="form-control text-center">
            <option value="">Tamanho</option>
            <option v-for="t in tamanhos" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>

        <!-- Tecido -->
        <div class="col-md-2">
          <input
            v-model="filtroTecido"
            class="form-control text-center"
            placeholder="Tecido"
          />
        </div>

        <!-- Cor -->
        <div class="col-md-2">
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
          <router-link to="/estoque/movimento" class="btn btn-success">
            Entrada/Saída
          </router-link>
        </div>

        <div class="col-auto">
          <button class="btn btn-info" @click="abrirHistorico">
            Histórico
          </button>
        </div>

      </div>
    </div>

    <!-- 📋 TABELA -->
    <div v-if="estoques.length" class="container">

      <table class="table table-striped text-center align-middle">

        <thead>
          <tr>
            <th>Produto</th>
            <th>Nome</th>
            <th>Tecido</th>
            <th>Cor</th>
            <th>Tamanho</th>
            <th>Saldo</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="e in estoques" :key="e.produtoId + '-' + e.tamanho">

            <td>{{ e.produtoId }}</td>
            <td>{{ e.produtoNome }}</td>
            <td>{{ e.produtoTecido }}</td>
            <td>{{ e.produtoCor }}</td>
            <td>{{ e.tamanho }}</td>
            <td>
              <span :class="e.saldo <= 0 ? 'text-danger' : 'text-success'">
                {{ e.saldo }}
              </span>
            </td>

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
      carregado: false,

      // filtros
      filtroIdProduto: "",
      filtroTamanho: "",
      filtroTecido: "",
      filtroCor: "",

      tamanhos: ["PP", "P", "M", "G", "GG"]
    }
  },

  methods: {

    async consultar() {
      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        const res = await axios.get(
          "http://localhost:8081/estoque/resumo",
          {
            params: {
              idProduto: this.filtroIdProduto || null,
              tamanho: this.filtroTamanho || null,
              tecido: this.filtroTecido || null,
              cor: this.filtroCor || null
            },
            headers: { Authorization: token }
          }
        )

        this.estoques = res.data
        this.carregado = true

      } catch (error) {
        console.error("Erro ao consultar estoque:", error)
        this.estoques = []
        this.carregado = true

      } finally {
        LoadingStore.hide()
      }
    },

    abrirHistorico() {
      window.open("/estoque/movimento/historico", "_blank")
    }
  }
}
</script>