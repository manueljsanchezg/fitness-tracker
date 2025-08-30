import { createMemoryHistory, createRouter } from 'vue-router'
import RegisterView from './views/RegisterView.vue'
import LoginView from './views/LoginView.vue'
import { validateRequest } from './api/auth'
import AdminView from './views/AdminView.vue'
import RoutinesView from './views/RoutinesView.vue'
import ForbiddenView from './views/ForbiddenView.vue'
import HomeView from './views/HomeView.vue'
import ProfileView from './views/ProfileView.vue'
import UnauthorizedView from './views/UnauthorizedView.vue'
import NotFoundView from './views/NotFoundView.vue'

const routes = [
  { path: '/home', component: HomeView },
  { path: '/login', component: LoginView, meta: { public: true } },
  { path: '/register', component: RegisterView, meta: { public: true } },
  { path: '/routines', component: RoutinesView, meta: { roles: ['user'] } },
  { path: '/my-profile', component: ProfileView },
  { path: '/admin-panel', component: AdminView, meta: { roles: ['admin'] } },
  { path: '/forbidden', component: ForbiddenView, meta: { public: true } },
  { path: '/unauthorized', component: UnauthorizedView, meta: { public: true } },
  { path: '/not-found', component: NotFoundView, meta: { public: true } },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  if (!to.meta.public) {
    const data = {
      roles: (to.meta.roles as string[]) ?? null
    }
    const response = await validateRequest(data)
    if (!response.success && response.errorCode) {
      switch(response.errorCode) {
        case 401:
          return next('/login')
        case 403:
          return next('/forbidden')
      }
    }
    return next()
  }
  return next()
})