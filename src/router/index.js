import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/LoginPage.vue'
import Home from '../views/HomePage.vue'
import Usuarios from '../views/UsuariosPage.vue'
import CadastroUsuario from '../views/CadastroUsuario.vue'
import Clientes from '../views/Clientes.vue'
import CadastroCliente from '../views/CadastroCliente.vue'


const routes = [
  { path: '/', component: Login },

  { path: '/home', component: Home, meta: { requiresAuth: true } },

  { path: '/usuarios', component: Usuarios, meta: { requiresAuth: true } },

  { path: '/usuarios/novo', component: CadastroUsuario, meta: { requiresAuth: true } },

  { path: '/clientes', component: Clientes, meta: { requiresAuth: true } },

  { path: '/clientes/novo', component: CadastroCliente, meta:{ requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 GUARD (DEPOIS de criar router)
router.beforeEach((to, from, next) => {

  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')
  } else {
    next()
  }

})

export default router