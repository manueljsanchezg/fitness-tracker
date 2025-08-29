<template>
  <section v-if="showSidebar">
    <b-button 
    type="is-text" 
    icon-left="menu"
    size="is-large" 
    @click="isOpen = true"
    >
    </b-button>
    <SideBar v-model="isOpen" />
  </section>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { refreshToken } from './api/auth'
import { router } from './router'
import { useAuthStore } from './store/authStore'
import { scheduleTokenRefresh } from './utils/utils'
import SideBar from './components/SideBar.vue'
import { useRoute } from 'vue-router'


const authStore = useAuthStore()

const isOpen = ref(false)
const route = useRoute()

const showSidebar = computed(() => {
  return !['/login', 'register'].includes(route.path)
})

onMounted(async () => {
  try {
    const { success, data } = await refreshToken()
    if (success && data?.expiresIn) {
      authStore.email = data.user.email
      authStore.role = data.user.role
      scheduleTokenRefresh(data.expiresIn)
    } else {
      router.push('/login')
    }
  } catch {
    router.push('/login')
  }
})
</script>

<style scoped>
nav {
  width: 100%;
  height: 100%;
}

main {
  width: 100%;
  height: 100%;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
