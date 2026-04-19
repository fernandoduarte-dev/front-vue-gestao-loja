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
import axios from "axios"
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

      tamanhos: ["PP", "P", "M", "G", "GG"],

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

    // 🔹 Salvar entrada
    async salvar() {

      if (!this.form.produtoId) {
        alert("Selecione um produto")
        return
      }

      if (!this.form.tamanho) {
        alert("Selecione o tamanho")
        return
      }

      if (!this.form.quantidade || this.form.quantidade <= 0) {
        alert("Quantidade inválida")
        return
      }

      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        await axios.post(
          "http://localhost:8081/estoque/entrada",
          null,
          {
            params: {
              produtoId: this.form.produtoId,
              tamanho: this.form.tamanho,
              quantidade: Number(this.form.quantidade)
            },
            headers: {
              Authorization: token
            }
          }
        )

        ToastStore.open("Entrada realizada com sucesso!", "success")

        this.resetForm()

      } catch (error) {
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