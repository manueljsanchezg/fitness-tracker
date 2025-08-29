<template>
  <Transition name="slide">
    <section class="side-bar" v-if="isOpen">
      <b-button type="is-text" size="is-large" @click="closeModal">
        △
      </b-button>

      <nav v-if="authStore.role = 'user'">
        <b-navbar-item tag="router-link" to="/">Home</b-navbar-item>
        <b-navbar-item tag="router-link" to="/routines">Routines</b-navbar-item>
      </nav>

      <nav v-else-if="authStore.role = 'admin'">
        <b-navbar-item tag="router-link" to="/">Home</b-navbar-item>
        <b-navbar-item tag="router-link" to="/admin-panel">Admin Panel</b-navbar-item>
      </nav>
    </section>
  </Transition>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/authStore';


const authStore = useAuthStore()
const isOpen = defineModel()

function closeModal() {
  isOpen.value = false
}


</script>

<style scoped>
.side-bar {
  width: 150px;
  background-color: #0f172a;
  color: white;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-radius: 0 12px 12px 0;
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