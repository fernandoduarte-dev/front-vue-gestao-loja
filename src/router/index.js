import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/LoginPage.vue'
import Home from '../views/HomePage.vue'
import Usuarios from '../views/UsuariosPage.vue'
import CadastroUsuario from '../views/CadastroUsuario.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home },

  { path: '/usuarios', component: Usuarios },
  { path: '/usuarios/novo', component: CadastroUsuario }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router