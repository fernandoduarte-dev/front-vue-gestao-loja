<template>
  <AppLayout titulo="Cadastro de Usuário">

    <div class="d-flex justify-content-center">

      <div class="col-md-5">

        <div class="card shadow-sm p-4">

          <h5 class="mb-3 text-center">Novo Usuário</h5>

          <form @submit.prevent="cadastrar">

            <!-- USERNAME -->
            <div class="mb-3">
              <label class="form-label">Nome</label>
              <input
                v-model="usuario.nome"
                type="text"
                class="form-control"
                required
              >
            </div>

            <!-- EMAIL -->
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                v-model="usuario.email"
                type="email"
                class="form-control"
                required
              >
            </div>

            <!-- SENHA -->
            <div class="mb-3">
              <label class="form-label">Senha</label>
              <input
                v-model="usuario.senha"
                type="password"
                class="form-control"
                required
              >
            </div>

            <!-- BOTÕES -->
            <div class="d-flex justify-content-between mt-4">

              <router-link to="/usuarios" class="btn btn-secondary">
                Voltar
              </router-link>

              <button type="submit" class="btn btn-primary">
                Cadastrar
              </button>

            </div>

          </form>

          <!-- ALERTA -->
          <div
            v-if="mensagem"
            class="alert mt-3"
            :class="sucesso ? 'alert-success' : 'alert-danger'"
          >
            {{ mensagem }}
          </div>

        </div>

      </div>

    </div>

  </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/AppLayout.vue"
import axios from "axios"
import LoadingStore from "@/store/loading";

export default {
  name: "CadastroUsuario",
  components: { AppLayout },

  data() {
    return {
      usuario: {
        nome: '',
        email: '',
        senha: ''
      },
      mensagem: '',
      sucesso: false
    }
  },

  methods: {
    async cadastrar() {

      LoadingStore.show()


      try {
        await axios.post('http://localhost:8081/usuario', this.usuario)

        this.mensagem = 'Usuário cadastrado com sucesso!'
        this.sucesso = true

        this.usuario = { nome: '', email: '', senha: '' }

      } catch (e) {
        this.mensagem = 'Erro ao cadastrar usuário.'
        this.sucesso = false
      } finally {
        LoadingStore.hide()
      }
    }
  }
}
</script>