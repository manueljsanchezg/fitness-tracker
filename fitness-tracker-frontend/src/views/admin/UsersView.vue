<template>
  <section class="users-section">
    <h1 class="title">Mis Usuarios</h1>

    <p v-if="isLoading" class="loading">Cargando usuarios...</p>

    <div v-else class="users-container">
      <div v-for="user in users" :key="user.email" class="user-card">
        <div class="card-header">
          {{ user.name }} {{ user.surname }}
        </div>

        <div class="card-content">
          <p><b-icon icon="email" size="is-small"></b-icon> {{ user.email }}</p>
          <p><b-icon icon="account" size="is-small"></b-icon> {{ user.role }}</p>
        </div>
      </div>
    </div>

    <div class="pagination">
      <b-button @click="prevPage" :disabled="page === 0"><<</b-button>
      <span class="page-number">{{ page + 1 }} / {{ totalPages }}</span>
      <b-button @click="nextPage" :disabled="page === totalPages - 1">>></b-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getAllUsers } from '../../api/user'
import { router } from '../../router'

interface User {
  name: string
  surname: string
  email: string
  role: string
}

const isLoading = ref(true)
const users = ref<User[]>([])
const limit = ref(10)
const skip = ref(0)
const page = ref(0)
const totalUsers = ref(0)

const totalPages = computed(() => Math.ceil(totalUsers.value / limit.value))

function nextPage() {
  page.value += 1
  skip.value += limit.value
}

function prevPage() {
  page.value -= 1
  skip.value -= limit.value
}

async function fetchUsers() {
  const { success, data, errorCode } = await getAllUsers(limit.value, skip.value)
  if (success) {
    users.value = data.users
    totalUsers.value = data.totalUsers
  } else {
    if (errorCode === 401) router.push('/unauthorized')
    else router.push('/not-found')
  }
}

onMounted(async () => {
  try {
    await fetchUsers()
  } finally {
    isLoading.value = false
  }
})

watch(page, 
  () => {
    fetchUsers()
    window.scrollTo(0, 0)
  })
</script>

<style scoped>
.users-section {
  max-width: 400px;
  margin: 0 auto;
  padding: 15px;
}

.title {
  text-align: center;
  margin-bottom: 15px;
}

.loading {
  text-align: center;
  font-size: 1em;
}

.users-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-card {
  background: #2c2c2c; /* fondo oscuro */
  color: #f0f0f0;      /* texto claro */
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 8px;
  border-bottom: 1px solid #555;
  padding-bottom: 4px;
}

.card-content p {
  margin: 5px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
}

.page-number {
  font-weight: bold;
}
</style>

