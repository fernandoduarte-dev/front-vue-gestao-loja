<template>
  <AppLayout titulo="Estoque">

    <!-- 🔍 FILTROS -->
    <div class="container mb-4">

      <div class="row justify-content-center mb-3 g-2">

        <div class="col-md-3">
          <input
            v-model="filtro.idProduto"
            class="form-control text-center"
            placeholder="Código Produto"
          />
        </div>

        <div class="col-md-2">
          <select v-model="filtro.tamanho" class="form-control text-center">
            <option value="">Tamanho</option>
            <option v-for="t in tamanhos" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>

        <div class="col-md-2">
          <input
            v-model="filtro.tecido"
            class="form-control text-center"
            placeholder="Tecido"
          />
        </div>

        <div class="col-md-2">
          <input
            v-model="filtro.cor"
            class="form-control text-center"
            placeholder="Cor"
          />
        </div>

      </div>

      <!-- 🔘 BOTÕES -->
      <div class="d-flex justify-content-center gap-2 flex-wrap">

        <button class="btn btn-primary" @click="consultar">
          Consultar
        </button>

        <router-link to="/estoque/entrada" class="btn btn-success">
          Entrada
        </router-link>

        <button class="btn btn-warning px-4" @click="irParaSaidaItens">
          Saída
        </button>

        <button class="btn btn-info" @click="abrirHistorico">
          Histórico de Movimentos
        </button>

      </div>

    </div>

    <!-- 📋 TABELA -->
    <div v-if="estoques.length" class="container">

      <table class="table table-striped text-center align-middle">

        <thead>
          <tr>
            <th>Código Produto</th>
            <th>Nome</th>
            <th>Tecido</th>
            <th>Cor</th>
            <th>Tamanho</th>
            <th>Saldo</th>
            <th>Ações</th>
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
              <span :class="e.saldo <= 0 ? 'text-danger fw-bold' : 'text-success fw-bold'">
                {{ e.saldo }}
              </span>
            </td>

            <!-- 🔥 BOTÃO CORRIGIDO -->
            <td>
              <button
                class="btn btn-sm btn-dark"
                @click="abrirSkus(e.produtoId, e.tamanho)"
              >
                Ver SKUs
              </button>
            </td>

          </tr>
        </tbody>

      </table>

    </div>

    <p v-else-if="carregado" class="text-center text-muted">
      Nenhum registro encontrado
    </p>

    <!-- 🔥 MODAL SKUS -->
    <div v-if="modalSkus" class="modal fade show d-block">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              SKUs Disponíveis {{ produtoSelecionado }} - {{ tamanhoSelecionado }}
            </h5>
            <button class="btn-close" @click="fecharModal"></button>
          </div>

          <div class="modal-body">

            <table class="table table-sm text-center">
              <thead>
                <tr>
                  <th>SKU</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(s, index) in skus" :key="index">
                  <td class="fw-bold">
                    {{ s }}
                  </td>
                </tr>
              </tbody>
            </table>

            <p v-if="!skus.length" class="text-center text-muted">
              Nenhum SKU disponível para este tamanho
            </p>

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
  name: "EstoquePage",
  components: { AppLayout },

  data() {
    return {
      estoques: [],
      carregado: false,

      filtro: {
        idProduto: "",
        tamanho: "",
        tecido: "",
        cor: ""
      },

      tamanhos: ["PP", "P", "M", "G", "GG"],

      // 🔥 SKUs
      skus: [],
      modalSkus: false,
      produtoSelecionado: null,
      tamanhoSelecionado: null
    }
  },

  methods: {

    async consultar() {
      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        const { data } = await axios.get(
          "http://localhost:8081/estoque/resumo",
          {
            params: {
              idProduto: this.filtro.idProduto || null,
              tamanho: this.filtro.tamanho || null,
              tecido: this.filtro.tecido || null,
              cor: this.filtro.cor || null
            },
            headers: { Authorization: token }
          }
        )

        this.estoques = data
        this.carregado = true

      } catch (error) {
        ToastStore.open("Erro ao consultar estoque", "error")
        this.estoques = []
        this.carregado = true

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔥 CORRIGIDO (AGORA USA PRODUTO + TAMANHO)
    async abrirSkus(produtoId, tamanho) {
      this.modalSkus = true
      this.produtoSelecionado = produtoId
      this.tamanhoSelecionado = tamanho

      try {
        const token = localStorage.getItem("token")

        const { data } = await axios.get(
          `http://localhost:8081/produto-item/${produtoId}/skus`,
          {
            params: {
              tamanho: tamanho || null
            },
            headers: { Authorization: token }
          }
        )

        this.skus = data

      } catch (error) {
        ToastStore.open("Erro ao buscar SKUs", "error")
        this.skus = []
      }
    },

    fecharModal() {
      this.modalSkus = false
      this.skus = []
      this.produtoSelecionado = null
      this.tamanhoSelecionado = null
    },

    abrirHistorico() {
      window.open("/estoque/movimento/historico", "_blank")
    },

    irParaSaidaItens() {
      this.$router.push("/estoque/saida-itens")
    }

  }
}
</script>