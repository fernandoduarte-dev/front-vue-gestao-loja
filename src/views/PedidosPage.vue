<template>
  <AppLayout titulo="Pedidos">

    <!-- FILTRO -->
    <div class="container mb-4">
      <div class="row justify-content-center g-2">

        <div class="col-md-4">
          <input
            v-model="filtroCliente"
            class="form-control text-center"
            placeholder="Nome do cliente"
            @keyup.enter="buscarPedidos"
          />
        </div>

        <div class="col-md-3">
          <input
            v-model="filtroId"
            class="form-control text-center"
            placeholder="ID do pedido"
            @keyup.enter="buscarPedidos"
          />
        </div>

        <div class="col-md-2">
          <button class="btn btn-dark w-100" @click="buscarPedidos">
            Buscar
          </button>
        </div>

        <div class="col-md-2">
          <button class="btn btn-success w-100" @click="novoPedido">
            Novo Pedido
          </button>
        </div>

      </div>
    </div>

    <!-- LISTA -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10">

          <table class="table text-center">

            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              <!-- LISTA -->
              <tr v-for="p in pedidos" :key="p.id">
                <td>{{ p.id }}</td>
                <td>{{ p.clienteNome || "-" }}</td>

                <td>
                  <span :class="badgeStatus(p.status)">
                    {{ p.status || "-" }}
                  </span>
                </td>

                <td>
                  R$ {{ formatarValor(p.valorFinal) }}
                </td>

                <td>
                  {{ formatarData(p.dataCriacao) }}
                </td>

                <td>
                  <button
                    class="btn btn-primary btn-sm"
                    @click="abrirPedido(p.id)"
                  >
                    Abrir
                  </button>
                </td>
              </tr>

            

            </tbody>

          </table>

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
  name: "PedidosListPage",
  components: { AppLayout },

  data() {
    return {
      pedidos: [],
      filtroCliente: "",
      filtroId: "",
      buscou: false
    }
  },

  methods: {

    // 🔹 BUSCAR PEDIDOS
    async buscarPedidos() {
      LoadingStore.show()

      try {
        const { data } = await api.get("/pedido", {
          params: {
            cliente: this.filtroCliente || null,
            id: this.filtroId ? Number(this.filtroId) : null
          }
        })

        this.pedidos = data || []
        this.buscou = true

      } catch (error) {
        console.error("Erro ao buscar pedidos:", error)
        ToastStore.open("Erro ao buscar pedidos", "error")

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 NAVEGAÇÃO
    novoPedido() {
      this.$router.push("/pedido/novo")
    },

    abrirPedido(id) {
      if (!id) return
      this.$router.push(`/pedido/${id}`)
    },

    // 🔹 STATUS BADGE
    badgeStatus(status) {
      switch (status) {
        case "CRIADO": return "badge bg-secondary"
        case "RESERVADO": return "badge bg-warning text-dark"
        case "EM_ANDAMENTO": return "badge bg-primary"
        case "FINALIZADO": return "badge bg-success"
        case "CANCELADO": return "badge bg-danger"
        default: return "badge bg-dark"
      }
    },

    // 🔹 FORMATAÇÃO
    formatarValor(valor) {
      if (!valor) return "0,00"
      return Number(valor).toFixed(2).replace(".", ",")
    },

    formatarData(data) {
      if (!data) return "-"
      try {
        return new Date(data).toLocaleDateString("pt-BR")
      } catch {
        return "-"
      }
    }

  }
}
</script>