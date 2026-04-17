<template>
  <AppLayout titulo="Cadastro de Produto">

    <div class="container-fluid">
      <div class="card shadow-sm p-4 w-100">

        <h5 class="mb-3 text-center">Novo Produto</h5>

        <form @submit.prevent="cadastrar">

          <!-- NOME -->
          <div class="mb-3">
            <label class="form-label">Nome</label>
            <input v-model="produto.nome" type="text" class="form-control" required>
          </div>


          <!-- LINHA 1 -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Tecido</label>
              <input v-model="produto.tecido" type="text" class="form-control">
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Cor</label>
              <input v-model="produto.cor" type="text" class="form-control">
            </div>

            
          </div>

          <!-- LINHA 2 -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Valor de Venda</label>
              <input v-model="produto.valorVenda" type="number" step="0.01" class="form-control">
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Valor de Locação</label>
              <input v-model="produto.valorLocacao" type="number" step="0.01" class="form-control">
            </div>
          </div>

         

          <!-- DESCRIÇÃO -->
          <div class="mb-3">
            <label class="form-label">Descrição</label>
            <input v-model="produto.descricao" type="text" class="form-control">
          </div>

          <!-- BOTÕES -->
          <div class="d-flex justify-content-between mt-4">
            <router-link to="/produtos" class="btn btn-secondary">Voltar</router-link>
            <button type="submit" class="btn btn-primary">Cadastrar</button>
          </div>

        </form>

        <!-- ALERTA -->
        <div v-if="mensagem" class="alert mt-3" :class="sucesso ? 'alert-success' : 'alert-danger'">
          {{ mensagem }}
        </div>

      </div>
    </div>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import axios from "axios"
import LoadingStore from "@/store/loading"

export default {
  name: "CadastroProduto",
  components: { AppLayout },

  data() {
    return {
      produto: {
        nome: "",
        descricao: "",
        tecido: "",
        cor: "",
        valorVenda: "",
        valorLocacao: ""
      },
      mensagem: "",
      sucesso: false
    }
  },

  methods: {
    async cadastrar() {
      LoadingStore.show()

      try {
        const token = localStorage.getItem("token")

        await axios.post("http://localhost:8081/produto", this.produto, {
          headers: {
            Authorization: token
          }
        })

        this.mensagem = "Produto cadastrado com sucesso!"
        this.sucesso = true

        // limpa formulário
        this.produto = {
          nome: "",
          descricao: "",
          tecido: "",
          cor: "",
          valorVenda: "",
          valorLocacao: ""
        }

      } catch (error) {
        console.error(error)
        this.mensagem = "Erro ao cadastrar produto."
        this.sucesso = false

      } finally {
        LoadingStore.hide()
      }
    }
  }
}
</script>