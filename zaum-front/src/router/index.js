import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LobbyView from '../views/LobbyView.vue'
import gameView from '../views/gameView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    //component: HomeView,
    component: gameView,
  },
  {
    path: '/home',
    redirect: {name:'home'}
  },
  {
    path: '/lobby',
    name: 'lobby',
    component: LobbyView,
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
