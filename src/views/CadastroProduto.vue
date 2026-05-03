<template>
  <AppLayout titulo="Cadastro Tipo Produto">

    <div class="container">

      <div class="card shadow-sm p-4">

        <h5 class="mb-4 text-center">Tipo Produto</h5>

        <form @submit.prevent="cadastrar">

          <!-- NOME -->
          <div class="mb-3">
            <label class="form-label">Tipo Peça</label>
            <input v-model="produto.nome" type="text" class="form-control" required />
          </div>

          <!-- LINHA -->
          <div class="row">

            <div class="col-md-6 mb-3">
              <label class="form-label">Tecido</label>
              <input v-model="produto.tecido" type="text" class="form-control" />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Cor</label>
              <input v-model="produto.cor" type="text" class="form-control" />
            </div>

          </div>

          

          <!-- BOTÕES -->
          <div class="d-flex justify-content-between mt-4">
            <router-link to="/produtos" class="btn btn-secondary">
              Voltar
            </router-link>

            <button type="submit" class="btn btn-primary">
              Cadastrar
            </button>
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
import api from "@/services/api"
import LoadingStore from "@/store/loading"

export default {
  name: "CadastroProduto",
  components: { AppLayout },

  data() {
    return {
      produto: {
        nome: "",
        tecido: "",
        cor: ""
      },
      mensagem: "",
      sucesso: false
    }
  },

  methods: {

    async cadastrar() {
      LoadingStore.show()

      try {
        await api.post("/produto", this.produto)

        this.mensagem = "Produto cadastrado com sucesso!"
        this.sucesso = true

        this.produto = {
          nome: "",
          tecido: "",
          cor: ""
        }

      } catch (error) {
        console.error("Erro ao cadastrar produto:", error)
        this.mensagem = "Erro ao cadastrar produto."
        this.sucesso = false

      } finally {
        LoadingStore.hide()
      }
    }

  }
}
</script>