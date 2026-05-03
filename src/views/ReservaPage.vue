<template>
  <AppLayout titulo="Reservas">

    <!-- 🔍 FILTROS -->
    <div class="container mb-4">

      <div class="row justify-content-center mb-3 g-2">

        <div class="col-md-3">
          <input
            v-model="filtro.produtoId"
            class="form-control text-center"
            placeholder="Código Produto"
          />
        </div>

        <div class="col-md-3">
          <input
            v-model="filtro.cliente"
            class="form-control text-center"
            placeholder="Cliente"
          />
        </div>

      </div>

      <!-- 🔘 BOTÃO -->
      <div class="d-flex justify-content-center gap-2 flex-wrap">

        <button class="btn btn-primary" @click="consultar">
          Consultar
        </button>

      </div>

    </div>

    <!-- 📋 TABELA -->
    <div v-if="reservas.length" class="container">

      <table class="table table-striped text-center align-middle">

        <thead>
          <tr>
            <th>SKU</th>
            <th>Produto</th>
            <th>Cliente</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Pedido</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in reservas" :key="r.pedidoId + '-' + r.produtoItemId">

            <td class="fw-bold">{{ r.sku }}</td>
            <td>{{ r.produtoItemId }}</td>
            <td>{{ r.clienteNome }}</td>
            <td>{{ formatDate(r.dataInicio) }}</td>
            <td>{{ formatDate(r.dataFim) }}</td>
            <td>#{{ r.pedidoId }}</td>

            <td>
              <button
                class="btn btn-sm btn-dark"
                @click="verDetalhes(r)"
              >
                Ver
              </button>
            </td>

          </tr>
        </tbody>

      </table>

    </div>

    <p v-else-if="carregado" class="text-center text-muted">
      Nenhuma reserva encontrada
    </p>

    <!-- 🔥 MODAL DETALHES -->
    <div v-if="modal" class="modal fade show d-block">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              Reserva #{{ reservaSelecionada?.pedidoId }}
            </h5>
            <button class="btn-close" @click="fecharModal"></button>
          </div>

          <div class="modal-body">

            <p><strong>SKU:</strong> {{ reservaSelecionada?.sku }}</p>
            <p><strong>Cliente:</strong> {{ reservaSelecionada?.clienteNome }}</p>
            <p><strong>Período:</strong>
              {{ formatDate(reservaSelecionada?.dataInicio) }} até
              {{ formatDate(reservaSelecionada?.dataFim) }}
            </p>

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
  name: "CalendarioReservas",
  components: { AppLayout },

  data() {
    return {
      reservas: [],
      carregado: false,

      filtro: {
        produtoId: "",
        cliente: ""
      },

      modal: false,
      reservaSelecionada: null
    }
  },

  methods: {

    // 🔹 CONSULTAR RESERVAS
    async consultar() {
      LoadingStore.show()

      try {
        const { data } = await api.get("/reservas/calendario", {
          params: {
            produtoId: this.filtro.produtoId || null,
            cliente: this.filtro.cliente || null
          }
        })

        this.reservas = data
        this.carregado = true

      } catch (error) {
        console.error("Erro ao consultar reservas:", error)
        ToastStore.open("Erro ao consultar reservas", "error")

        this.reservas = []
        this.carregado = true

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 DETALHES
    verDetalhes(reserva) {
      this.reservaSelecionada = reserva
      this.modal = true
    },

    // 🔹 FECHAR MODAL
    fecharModal() {
      this.modal = false
      this.reservaSelecionada = null
    },

    // 🔹 FORMATAR DATA
    formatDate(date) {
      if (!date) return ""
      return new Date(date).toLocaleDateString("pt-BR")
    }

  }
}
</script>