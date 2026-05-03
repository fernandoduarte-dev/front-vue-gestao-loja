<template>
  <AppLayout titulo="Entrada de Estoque">

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

            <!-- 📏 TAMANHO -->
            <div class="mb-3">
              <select v-model="form.tamanho" class="form-control text-center">
                <option value="">Tamanho</option>
                <option v-for="t in tamanhos" :key="t">{{ t }}</option>
              </select>
            </div>

            <!-- 🔢 QUANTIDADE -->
            <div class="mb-3">
              <input
                type="number"
                v-model="form.quantidade"
                class="form-control text-center"
                placeholder="Quantidade"
                min="1"
              />
            </div>

            <!-- 🔘 BOTÕES -->
            <div class="d-flex justify-content-center gap-2 mt-3 flex-wrap">

              <button class="btn btn-success px-4" @click="salvar">
                Confirmar Entrada
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
  name: "EntradaEstoquePage",

  components: {
    AppLayout,
    BuscaProdutoModal
  },

  data() {
    return {
      modalProduto: false,

      tamanhos: [
        "Único","1","2","4","6","8","10","12","14","16",
        "36","38","40","42","44","46","48","50","52","54",
        "56","58","60","62","64","66","68","70","72","74"
      ],

      form: {
        produtoId: null,
        produtoNome: "",
        tamanho: "",
        quantidade: null
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

    // 🔹 Validação simples centralizada
    validarFormulario() {
      if (!this.form.produtoId) return "Selecione um produto"
      if (!this.form.tamanho) return "Selecione o tamanho"
      if (!this.form.quantidade || this.form.quantidade <= 0) return "Quantidade inválida"
      return null
    },

    // 🔹 Salvar entrada
    async salvar() {
      const erro = this.validarFormulario()

      if (erro) {
        ToastStore.open(erro, "error")
        return
      }

      LoadingStore.show()

      try {
        await api.post("/estoque/entrada", null, {
          params: {
            produtoId: this.form.produtoId,
            tamanho: this.form.tamanho,
            quantidade: Number(this.form.quantidade)
          }
        })

        ToastStore.open("Entrada realizada com sucesso!", "success")

        this.resetForm()

      } catch (error) {
        console.error("Erro ao realizar entrada:", error)
        ToastStore.open("Erro ao realizar entrada", "error")

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 Voltar
    voltar() {
      this.$router.push("/estoque")
    },

    // 🔹 Reset
    resetForm() {
      this.form = {
        produtoId: null,
        produtoNome: "",
        tamanho: "",
        quantidade: null
      }
    }

  }
}
</script>