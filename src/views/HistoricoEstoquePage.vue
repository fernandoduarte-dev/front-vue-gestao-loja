<template>
  <AppLayout titulo="Histórico de Estoque">

    <div class="container py-4">

      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">

          <!-- 🔍 FILTROS -->
          <div class="card p-3 mb-3">

            <div class="row g-2">

              <!-- Produto -->
              <div class="col-md-3">
                <input
                  class="form-control text-center"
                  v-model="filtro.produtoId"
                  placeholder="ID Produto"
                  type="number"
                />
              </div>

              <!-- Tipo -->
              <div class="col-md-2">
                <select class="form-control text-center" v-model="filtro.tipoMovimento">
                  <option value="">Tipo</option>
                  <option value="ENTRADA">Entrada</option>
                  <option value="SAIDA">Saída</option>
                </select>
              </div>

              <!-- Usuário -->
              <div class="col-md-3">
                <input
                  class="form-control text-center"
                  v-model="filtro.usuario"
                  placeholder="Usuário"
                />
              </div>

              <!-- Data início -->
              <div class="col-md-2">
                <input
                  type="date"
                  class="form-control text-center"
                  v-model="filtro.dataInicio"
                />
              </div>

              <!-- Data fim -->
              <div class="col-md-2">
                <input
                  type="date"
                  class="form-control text-center"
                  v-model="filtro.dataFim"
                />
              </div>

            </div>

            <!-- 🔘 BOTÃO -->
            <div class="d-flex justify-content-center gap-2 mt-3 flex-wrap">

              <button class="btn btn-primary px-4" @click="buscar">
                Buscar
              </button>

              <button class="btn btn-secondary px-4" @click="voltar">
                Voltar
              </button>
            </div>

          </div>

          <!-- 📋 TABELA -->
          <div class="card p-3">

            <table class="table table-sm text-center align-middle">

              <thead>
                <tr>
                  <th>Código Produto</th>
                  <th>Tamanho</th>
                  <th>Qtd</th>
                  <th>Tipo</th>
                  <th>Usuário</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="m in movimentos" :key="m.id">
                  <td>{{ m.produtoId }}</td>
                  <td>{{ m.tamanho }}</td>
                  <td>{{ m.quantidade }}</td>
                  <td>{{ m.tipoMovimento }}</td>
                  <td>{{ m.usuarioNome }}</td>
                  <td>{{ formatDate(m.data) }}</td>
                </tr>
              </tbody>

            </table>

          </div>

        </div>
      </div>

    </div>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import axios from "axios"
import LoadingStore from "@/store/loading"
import { ToastStore } from "@/store/toast"

export default {
  name: "EstoqueHistoricoPage",

  components: {
    AppLayout
  },

  data() {
    return {
      filtro: {
        produtoId: null,
        tipoMovimento: null,
        usuario: null,
        dataInicio: null,
        dataFim: null
      },

      movimentos: []
    }
  },

  methods: {

    async buscar() {

      LoadingStore.show()

      try {

        const token = localStorage.getItem("token")

        // 🔥 normalização (EVITA BUG DE "")
        const params = {
          produtoId: this.filtro.produtoId || null,
          tipoMovimento: this.filtro.tipoMovimento || null,
          usuario: this.filtro.usuario || null,
          dataInicio: this.filtro.dataInicio || null,
          dataFim: this.filtro.dataFim || null
        }

        const response = await axios.get(
          "http://localhost:8081/estoque/historico",
          {
            params,
            headers: {
              Authorization: token
            }
          }
        )

        this.movimentos = response.data

      } catch (error) {
        ToastStore.open("Erro ao buscar histórico", "error")
      } finally {
        LoadingStore.hide()
      }
    },

     voltar() {
      this.$router.push("/estoque")
    },

    formatDate(date) {
      if (!date) return ""
      return new Date(date).toLocaleString("pt-BR")
    }

  },

  mounted() {
    // 🔥 já carrega tudo ao abrir a tela
    this.buscar()
  }
}
</script>