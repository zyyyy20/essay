import Home from '../pages/Home.vue'
import Article from '../pages/Article.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Admin from '../pages/Admin.vue'

export default [
  { path: '/', component: Home },
  { path: '/article/:id', component: Article },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admin', component: Admin }
]
