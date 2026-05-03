<template>
  <AppLayout titulo="Novo Pedido">

    <div class="container">

      <!-- =========================
        ETAPA 1 - CRIAÇÃO
      ========================== -->
      <div v-if="etapa === 1" class="card shadow-sm p-4 mb-4">

        <h5 class="text-center mb-4">Criar Pedido</h5>

        <!-- TIPO -->
        <div class="mb-3">
          <label class="form-label">Tipo do Pedido</label>
          <select v-model="pedido.tipo" class="form-control">
            <option value="">Selecione</option>
            <option value="LOCACAO">Locação</option>
            <option value="VENDA">Venda</option>
          </select>
        </div>

        <!-- CLIENTE -->
        <div class="row">
          <div class="col-md-8 mb-3">
            <input
              v-model="filtroCliente"
              class="form-control"
              placeholder="Nome do cliente"
            />
          </div>

          <div class="col-md-4 mb-3">
            <button class="btn btn-dark w-100" @click="buscarClientes">
              Buscar Cliente
            </button>
          </div>
        </div>

        <div v-if="cliente.nome" class="alert alert-secondary text-center">
          <strong>{{ cliente.nome }}</strong><br />
          <small>{{ cliente.cpf }}</small>
        </div>

        <!-- DATAS -->
        <div class="row">
          <div class="col-md-4 mb-3">
            <label>Evento</label>
            <input type="date" v-model="pedido.dataEvento" class="form-control" />
          </div>

          <div class="col-md-4 mb-3">
            <label>Retirada</label>
            <input type="date" v-model="pedido.dataRetirada" class="form-control" />
          </div>

          <div class="col-md-4 mb-3">
            <label>Devolução</label>
            <input type="date" v-model="pedido.dataDevolucao" class="form-control" />
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-primary px-4" @click="criarPedido">
            Criar Pedido
          </button>
        </div>

      </div>

      <!-- =========================
        ETAPA 2 - RESERVA
      ========================== -->
      <div v-if="etapa === 2" class="card shadow-sm p-4 mb-4">

        <h5 class="text-center mb-3">
          Pedido #{{ pedidoId }}
        </h5>

        <div class="text-center mb-4">
          <span class="badge bg-dark">CRIADO</span>
        </div>

        <!-- ITENS -->
        <h6 class="mb-3">Itens</h6>

        <div class="row">
          <div class="col-md-8 mb-3">
            <input v-model="item.sku"
                   class="form-control"
                   placeholder="SKU"/>
          </div>

          <div class="col-md-4 mb-3">
            <button class="btn btn-success w-100" @click="adicionarItem">
              Adicionar Item
            </button>
          </div>
        </div>

        <div v-if="pedido.itens.length" class="mb-4">
          <ul class="list-group">
            <li v-for="(i, index) in pedido.itens"
                :key="index"
                class="list-group-item">
              SKU: {{ i.produtoItemSku }}
            </li>
          </ul>
        </div>

        <!-- FINANCEIRO -->
        <h6 class="mb-3">Financeiro</h6>

        <div class="row">
          <div class="col-md-4 mb-3">
            <input v-model="pedido.valorTotal"
                   class="form-control"
                   placeholder="Valor Total"/>
          </div>

          <div class="col-md-4 mb-3">
            <input v-model="pedido.desconto"
                   class="form-control"
                   placeholder="Desconto"/>
          </div>

          <div class="col-md-4 mb-3">
            <input v-model="pedido.valorEntrada"
                   class="form-control"
                   placeholder="Entrada"/>
          </div>
        </div>

        <!-- PAGAMENTO -->
        <div class="mb-3">
          <label>Forma de pagamento</label>
          <select v-model="pedido.formaPagamento" class="form-control">
            <option value="">Selecione</option>
            <option value="PIX">PIX</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="CARTAO">Cartão</option>
          </select>
        </div>

        <!-- OBS -->
        <div class="row">
          <div class="col-md-6 mb-3">
            <textarea v-model="pedido.ajustes"
                      class="form-control"
                      placeholder="Ajustes"></textarea>
          </div>

          <div class="col-md-6 mb-3">
            <textarea v-model="pedido.observacoes"
                      class="form-control"
                      placeholder="Observações"></textarea>
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-primary px-4" @click="reservar">
            Confirmar Reserva
          </button>
        </div>

      </div>

      <!-- =========================
        ETAPA 3
      ========================== -->
      <div v-if="etapa === 3" class="card shadow-sm p-4 text-center">

        <h5>Pedido em andamento</h5>

        <button class="btn btn-warning mt-3" @click="iniciarUso">
          Cliente Pegou Roupa
        </button>

      </div>

      <!-- =========================
        ETAPA 4
      ========================== -->
      <div v-if="etapa === 4" class="card shadow-sm p-4 text-center">

        <h5>Pedido Finalizado</h5>

        <button class="btn btn-secondary mt-3" @click="reset">
          Novo Pedido
        </button>

      </div>

    </div>

    <!-- MODAL CLIENTE -->
    <div v-if="modalClientes" class="modal fade show d-block">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5>Selecionar Cliente</h5>
            <button class="btn-close" @click="modalClientes = false"></button>
          </div>

          <div class="modal-body">
            <table class="table text-center">
              <tr v-for="c in clientes" :key="c.id">
                <td>{{ c.nome }}</td>
                <td>{{ c.cpf }}</td>
                <td>
                  <button class="btn btn-primary btn-sm"
                          @click="selecionarCliente(c)">
                    Selecionar
                  </button>
                </td>
              </tr>
            </table>
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
  name: "PedidoPage",
  components: { AppLayout },

  data() {
    return {
      etapa: 1,
      pedidoId: null,

      pedido: {
        clienteId: null,
        tipo: "",
        valorTotal: null,
        desconto: null,
        valorEntrada: null,
        formaPagamento: "",
        ajustes: "",
        observacoes: "",
        dataEvento: null,
        dataRetirada: null,
        dataDevolucao: null,
        itens: []
      },

      cliente: {},
      clientes: [],
      filtroCliente: "",
      modalClientes: false,

      item: { sku: null }
    }
  },

  mounted() {
    const id = this.$route.params.id

    if (!id || id === "novo") return

    this.carregarPedido(id)
  },

  methods: {

    // 🔹 CARREGAR PEDIDO
    async carregarPedido(id) {
      LoadingStore.show()

      try {
        const { data } = await api.get(`/pedido/${id}`)

        this.pedidoId = data.id

        this.cliente = {
          nome: data.clienteNome,
          cpf: data.clienteCpf
        }

        this.pedido = {
          clienteId: data.clienteId,
          tipo: data.tipo,
          valorTotal: data.valorTotal,
          desconto: data.desconto,
          valorEntrada: data.valorEntrada,
          formaPagamento: data.formaPagamento,
          ajustes: data.ajustes,
          observacoes: data.observacoes,
          dataEvento: data.dataEvento,
          dataRetirada: data.dataRetirada,
          dataDevolucao: data.dataDevolucao,
          itens: data.itens || []
        }

        this.definirEtapaPorStatus(data.status)

      } catch (error) {
        console.error("Erro ao carregar pedido:", error)
        ToastStore.open("Erro ao carregar pedido", "error")

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 STATUS → ETAPA
    definirEtapaPorStatus(status) {
      switch (status) {
        case "CRIADO":
          this.etapa = 2
          break
        case "RESERVADO":
        case "EM_ANDAMENTO":
          this.etapa = 3
          break
        case "FINALIZADO":
          this.etapa = 4
          break
        default:
          this.etapa = 1
      }
    },

    // 🔹 BUSCAR CLIENTES
    async buscarClientes() {
      try {
        const { data } = await api.get("/cliente/nome", {
          params: {
            nome: this.filtroCliente || null
          }
        })

        this.clientes = data
        this.modalClientes = true

      } catch (error) {
        console.error(error)
        ToastStore.open("Erro ao buscar clientes", "error")
      }
    },

    selecionarCliente(c) {
      this.pedido.clienteId = c.id
      this.cliente = c
      this.modalClientes = false
    },

    // 🔹 CRIAR PEDIDO
    async criarPedido() {
      LoadingStore.show()

      try {
        const { data } = await api.post("/pedido", this.pedido)

        this.pedidoId = data.id
        this.etapa = 2

        ToastStore.open("Pedido criado", "success")

      } catch (error) {
        console.error(error)
        ToastStore.open("Erro ao criar pedido", "error")

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 ADICIONAR ITEM
    adicionarItem() {
      if (!this.item.sku) return

      if (this.pedido.itens.some(i => i.produtoItemSku === this.item.sku)) {
        ToastStore.open("SKU já adicionado", "warning")
        return
      }

      this.pedido.itens.push({ produtoItemSku: this.item.sku })
      this.item.sku = null
    },

    // 🔹 RESERVAR
    async reservar() {
      LoadingStore.show()

      try {
        await api.post(`/pedido/${this.pedidoId}/completar`, this.pedido)

        this.etapa = 3
        ToastStore.open("Pedido reservado", "success")

      } catch (error) {
        console.error(error)
        ToastStore.open("Erro ao reservar", "error")

      } finally {
        LoadingStore.hide()
      }
    },

    // 🔹 INICIAR USO
    async iniciarUso() {
      try {
        await api.post(`/pedido/${this.pedidoId}/iniciar`)

        this.etapa = 4
        ToastStore.open("Pedido em andamento", "success")

      } catch (error) {
        console.error(error)
        ToastStore.open("Erro ao iniciar pedido", "error")
      }
    },

    // 🔹 RESET
    reset() {
      this.etapa = 1
      this.pedidoId = null

      this.pedido = {
        clienteId: null,
        tipo: "",
        valorTotal: null,
        desconto: null,
        valorEntrada: null,
        formaPagamento: "",
        ajustes: "",
        observacoes: "",
        dataEvento: null,
        dataRetirada: null,
        dataDevolucao: null,
        itens: []
      }

      this.cliente = {}
      this.item = { sku: null }
      this.filtroCliente = ""
    }

  }
}
</script>