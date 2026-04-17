<template>
  <AppLayout titulo="Movimentar Estoque">

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

            <!-- 📋 TIPO MOVIMENTO -->
            <div class="mb-3">
              <select v-model="form.tipoMovimento" class="form-control text-center">
                <option value="">Tipo de movimento</option>
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>
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
                Salvar
              </button>

              <button class="btn btn-secondary px-4" @click="voltar">
                Voltar
              </button>

        

            </div>

          </div>

        </div>
      </div>

    </div>

    <!-- 🧩 MODAL PRODUTO -->
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
  name: "MovimentarEstoquePage",

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
        quantidade: null,
        tipoMovimento: ""
      }
    }
  },

  methods: {

    onProdutoSelecionado(produto) {
      this.form.produtoId = produto.id
      this.form.produtoNome = `${produto.nome} - ${produto.cor} - ${produto.tecido}`
    },

    async salvar() {

      if (!this.form.produtoId) return alert("Selecione um produto")
      if (!this.form.tamanho) return alert("Selecione o tamanho")
      if (!this.form.quantidade || this.form.quantidade <= 0) return alert("Quantidade inválida")
      if (!this.form.tipoMovimento) return alert("Selecione o tipo de movimento")

      LoadingStore.show()

      try {

        const token = localStorage.getItem("token")

        const url =
          this.form.tipoMovimento === "ENTRADA"
            ? "http://localhost:8081/estoque/entrada"
            : "http://localhost:8081/estoque/saida"

        await axios.post(url, null, {
          params: {
            produtoId: this.form.produtoId,
            tamanho: this.form.tamanho,
            quantidade: Number(this.form.quantidade)
          },
          headers: {
            Authorization: token
          }
        })

        ToastStore.open("Estoque atualizado!", "success")

        this.resetForm()

      } catch (error) {
        ToastStore.open("Erro ao movimentar estoque", "error")
      } finally {
        LoadingStore.hide()
      }
    },

    voltar() {
      this.$router.push("/estoque")
    },

    resetForm() {
      this.form = {
        produtoId: null,
        produtoNome: "",
        tamanho: "",
        quantidade: null,
        tipoMovimento: ""
      }
    }
  }
}
</script>