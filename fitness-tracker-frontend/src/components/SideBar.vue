<template>
<template>
  <section>
    <b-sidebar
      type="is-"
      :fullheight="true"
      :overlay="true"
      :right="false"
      v-model="isOpen"
    >
      <div class="p-1">
        <b-button 
          type="is-text" 
          size="is-large" 
          icon-left="close"
          @click="closeModal"
          >
        </b-button>
        <b-menu>
          <b-menu-list label="General">
            <b-menu-item
              tag="router-link"
              to="/home"
              icon="home"
              label="Home"
            />
            <b-menu-item
              tag="router-link"
              to="/my-profile"
              icon="account"
              label="Perfil"
            />
            <b-menu-item
              tag="router-link"
              to="/exercises"
              icon="weight-lifter"
              label="Ejercicios"
            />
          </b-menu-list>

          <b-menu-list v-if="authStore.role === 'user'" label="User">
            
            <b-menu-item
              tag="router-link"
              to="/routines"
              icon="calendar"
              label="Rutinas"
            />
          </b-menu-list>

          <b-menu-list v-else-if="authStore.role === 'admin'" label="Admin">
            <b-menu-item
              tag="router-link"
              to="/users"
              icon="account-tie"
              label="Usuarios"
            />
          </b-menu-list>
          
        </b-menu>
      </div>
    </b-sidebar>
  </section>
</template>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { watch, } from 'vue';


const authStore = useAuthStore()
const isOpen = defineModel()

const route = useRoute()

function closeModal() {
  isOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeModal()
  }
)


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

.p-1 {
  padding: 1em;
}

::v-deep(.menu-list a.is-active) {
  background-color: #334155 !important;
  color: #fff !important;
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