<template>
  <AppLayout titulo="Saída de Itens por SKU">

    <div class="container py-4">

      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-6">

          <div class="card shadow-sm p-4 form-box">

            <!-- 🔍 PRODUTO -->
            <div class="row g-2 align-items-center mb-3">
              <div class="col">
                <input
                  class="form-control text-center"
                  v-model="form.produtoNome"
                  placeholder="Produto"
                  disabled
                />
              </div>

              <div class="col-auto">
                <button class="btn btn-primary" @click="modalProduto = true">
                  Buscar
                </button>
              </div>
            </div>

            <!-- 🔎 BUSCAR ITENS -->
            <div class="text-center mb-3">
              <button class="btn btn-outline-primary" @click="buscarItens">
                Buscar SKUs Disponíveis
              </button>
            </div>

            <!-- 📦 LISTA -->
            <div v-if="itensDisponiveis.length" class="card p-2 lista-skus">

              <div
                v-for="item in itensDisponiveis"
                :key="item.id"
                class="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <div>
                  <strong>{{ item.sku }}</strong> | {{ item.tamanho }}
                </div>

                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="itensSelecionados"
                />
              </div>

            </div>

            <!-- 🔘 BOTÕES -->
            <div class="d-flex justify-content-center gap-2 mt-3 flex-wrap">

              <button class="btn btn-danger px-4" @click="confirmarSaida">
                Confirmar Saída
              </button>

              <button class="btn btn-secondary px-4" @click="voltar">
                Voltar
              </button>

            </div>

          </div>

        </div>
      </div>

    </div>

    <!-- 🧩 MODAL -->
    <BuscaProdutoModal
      :show="modalProduto"
      @fechar="modalProduto = false"
      @selecionado="onProdutoSelecionado"
    />

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import BuscaProdutoModal from "@/components/BuscaProdutoModal.vue"
import axios from "axios"
import LoadingStore from "@/store/loading"
import { ToastStore } from "@/store/toast"

export default {
  name: "SaidaItensPage",

  components: {
    AppLayout,
    BuscaProdutoModal
  },

  data() {
    return {
      modalProduto: false,

      itensDisponiveis: [],
      itensSelecionados: [],

      form: {
        produtoId: null,
        produtoNome: ""
      }
    }
  },

  methods: {

    // 🔹 Selecionar produto
    onProdutoSelecionado(produto) {
      this.form.produtoId = produto.id
      this.form.produtoNome = `${produto.nome} - ${produto.cor} - ${produto.tecido}`
      this.modalProduto = false
    },

    // 🔹 Buscar itens disponíveis
    async buscarItens() {

      if (!this.form.produtoId) {
        alert("Selecione um produto")
        return
      }

      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        const { data } = await axios.get(
          "http://localhost:8081/produto-item/disponiveis",
          {
            params: { produtoId: this.form.produtoId },
            headers: { Authorization: token }
          }
        )

        this.itensDisponiveis = data

      } catch (error) {
        ToastStore.open("Erro ao buscar itens", "error")
      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 Confirmar saída
    async confirmarSaida() {

      if (!this.itensSelecionados.length) {
        alert("Selecione ao menos um item")
        return
      }

      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        await axios.post(
          "http://localhost:8081/estoque/saida-itens",
          this.itensSelecionados,
          {
            headers: { Authorization: token }
          }
        )

        ToastStore.open("Saída realizada com sucesso!", "success")

        this.resetarTela()

      } catch (error) {
        ToastStore.open("Erro ao realizar saída", "error")
      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 Voltar
    voltar() {
      this.$router.push("/estoque")
    },

    // 🔹 Reset
    resetarTela() {
      this.itensDisponiveis = []
      this.itensSelecionados = []
      this.form = {
        produtoId: null,
        produtoNome: ""
      }
    }
  }
}
</script>

<style scoped>
.lista-skus {
  max-height: 350px;
  overflow-y: auto;
}
</style>