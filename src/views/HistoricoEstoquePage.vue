<template>
  <AppLayout titulo="Histórico de Estoque">

    <div class="container py-4">

      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">

          <!-- 🔍 FILTROS -->
          <div class="card p-3 mb-3">

            <div class="row g-2">

              <div class="col-md-3">
                <input
                  class="form-control text-center"
                  v-model="filtro.produtoId"
                  placeholder="ID Produto"
                  type="number"
                />
              </div>

              <div class="col-md-2">
                <select class="form-control text-center" v-model="filtro.tipoMovimento">
                  <option value="">Tipo</option>
                  <option value="ENTRADA">Entrada</option>
                  <option value="SAIDA">Saída</option>
                </select>
              </div>

              <div class="col-md-3">
                <input
                  class="form-control text-center"
                  v-model="filtro.usuario"
                  placeholder="Usuário"
                />
              </div>

              <div class="col-md-2">
                <input
                  type="date"
                  class="form-control text-center"
                  v-model="filtro.dataInicio"
                />
              </div>

              <div class="col-md-2">
                <input
                  type="date"
                  class="form-control text-center"
                  v-model="filtro.dataFim"
                />
              </div>

            </div>

            <div class="d-flex justify-content-center gap-2 mt-3 flex-wrap">
              <button class="btn btn-primary px-4" @click="buscar">
                Buscar
              </button>

              <button class="btn btn-secondary px-4" @click="limpar">
                Limpar
              </button>

              <button class="btn btn-dark px-4" @click="voltar">
                Voltar
              </button>
            </div>

          </div>

          <!-- 📋 TABELA -->
          <div class="card p-3">

            <table class="table table-sm text-center align-middle">

              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Tamanho</th>
                  <th>Tipo</th>
                  <th>Usuário</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>

                <tr v-if="movimentos.length === 0">
                  <td colspan="6">Nenhum registro encontrado</td>
                </tr>

                <tr v-for="m in movimentos" :key="m.id">
                  <td>{{ m.produtoId }}</td>

                  <!-- 🔥 fallback pra resolver problema de tamanho -->
                  <td>{{ m.tamanho || m.itemTamanho || "-" }}</td>

                 

                  <td>
                    <span
                      :class="[
                        'badge',
                        m.tipoMovimento === 'ENTRADA' ? 'bg-success' : 'bg-danger'
                      ]"
                    >
                      {{ m.tipoMovimento }}
                    </span>
                  </td>

                  <td>{{ m.usuarioNome || "-" }}</td>

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
import api from "@/services/api"
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
        produtoId: "",
        tipoMovimento: "",
        usuario: "",
        dataInicio: "",
        dataFim: ""
      },

      movimentos: []
    }
  },

  methods: {

    // 🔹 BUSCAR HISTÓRICO
    async buscar() {
      LoadingStore.show()

      try {
        const params = this.montarParams()

        const { data } = await api.get("/estoque/historico", {
          params
        })

        this.movimentos = data

      } catch (error) {
        console.error("Erro ao buscar histórico:", error)
        ToastStore.open("Erro ao buscar histórico", "error")

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 REMOVE CAMPOS VAZIOS
    montarParams() {
      const params = {}

      Object.keys(this.filtro).forEach(key => {
        if (this.filtro[key]) {
          params[key] = this.filtro[key]
        }
      })

      return params
    },

    // 🔹 LIMPAR FILTRO
    limpar() {
      this.filtro = {
        produtoId: "",
        tipoMovimento: "",
        usuario: "",
        dataInicio: "",
        dataFim: ""
      }

      this.buscar()
    },

    // 🔹 VOLTAR
    voltar() {
      this.$router.push("/estoque")
    },

    // 🔹 FORMATAR DATA
    formatDate(date) {
      if (!date) return ""
      return new Date(date).toLocaleString("pt-BR")
    }

  },

  mounted() {
    this.buscar()
  }
}
</script>