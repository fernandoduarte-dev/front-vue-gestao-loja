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
import api from "@/services/api"
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

    // 🔹 SELECIONAR PRODUTO
    onProdutoSelecionado(produto) {
      this.form.produtoId = produto.id
      this.form.produtoNome = `${produto.nome} - ${produto.cor} - ${produto.tecido}`
      this.modalProduto = false
    },

    // 🔹 VALIDAR PRODUTO
    validarProduto() {
      if (!this.form.produtoId) {
        ToastStore.open("Selecione um produto", "warning")
        return false
      }
      return true
    },

    // 🔹 BUSCAR ITENS DISPONÍVEIS
    async buscarItens() {
      if (!this.validarProduto()) return

      LoadingStore.show()

      try {
        const { data } = await api.get("/produto-item/disponiveis", {
          params: {
            produtoId: this.form.produtoId
          }
        })

        this.itensDisponiveis = data

      } catch (error) {
        console.error("Erro ao buscar itens:", error)
        ToastStore.open("Erro ao buscar itens", "error")

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 VALIDAR SAÍDA
    validarSaida() {
      if (!this.itensSelecionados.length) {
        ToastStore.open("Selecione ao menos um item", "warning")
        return false
      }
      return true
    },

    // 🔹 CONFIRMAR SAÍDA
    async confirmarSaida() {
      if (!this.validarSaida()) return

      LoadingStore.show()

      try {
        await api.post("/estoque/saida-itens", this.itensSelecionados)

        ToastStore.open("Saída realizada com sucesso!", "success")

        this.resetarTela()

      } catch (error) {
        console.error("Erro ao realizar saída:", error)
        ToastStore.open("Erro ao realizar saída", "error")

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 VOLTAR
    voltar() {
      this.$router.push("/estoque")
    },

    // 🔹 RESET TELA
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