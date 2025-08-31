import { createMemoryHistory, createRouter } from 'vue-router'
import RegisterView from './views/general/RegisterView.vue'
import LoginView from './views/general/LoginView.vue'
import { validateRequest } from './api/auth'
import RoutinesView from './views/user/RoutinesView.vue'
import ForbiddenView from './views/general/ForbiddenView.vue'
import HomeView from './views/general/HomeView.vue'
import ProfileView from './views/general/ProfileView.vue'
import UnauthorizedView from './views/general/UnauthorizedView.vue'
import NotFoundView from './views/general/NotFoundView.vue'
import UsersView from './views/admin/UsersView.vue'
import ExercisesView from './views/general/ExercisesView.vue'
import ExerciseCreateView from './views/admin/ExerciseCreateView.vue'
import ExerciseUpdateView from './views/admin/ExerciseUpdateView.vue'
import RoutinesCreateView from './views/user/RoutinesCreateView.vue'
import RoutinesUpdateView from './views/user/RoutinesUpdateView.vue'
import WorkOutLogsView from './views/user/WorkOutLogsView.vue'
import WorkOutLogsCreateView from './views/user/WorkOutLogsCreateView.vue'
import WorkOutLogsUpdateView from './views/user/WorkOutLogsUpdateView.vue'

const routes = [
  { path: '/home', component: HomeView },
  { path: '/login', component: LoginView, meta: { public: true } },
  { path: '/register', component: RegisterView, meta: { public: true } },
  { path: '/routines', component: RoutinesView, meta: { roles: ['user'] } },
  { path: '/routines/create', component: RoutinesCreateView, meta: { roles: ['user'] } },
  { path: '/routines/update/:id', component: RoutinesUpdateView, meta: { roles: ['user'] } },
  { path: '/workoutlogs', component: WorkOutLogsView, meta: { roles: ['user'] } },
  { path: '/workoutlogs/create', component: WorkOutLogsCreateView, meta: { roles: ['user'] } },
  { path: '/workoutlogs/update/:id', component: WorkOutLogsUpdateView, meta: { roles: ['user'] } },
  { path: '/my-profile', component: ProfileView },
  { path: '/users', component: UsersView, meta: { roles: ['admin'] } },
  { path: '/exercises', component: ExercisesView },
  { path: '/exercises/create', component: ExerciseCreateView, meta: { roles: ['admin'] } },
  { path: '/exercises/update/:id', component: ExerciseUpdateView, meta: { roles: ['admin'] } },
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