<template>
  <section class="routines-section">
    <h1 class="title">Mis Rutinas</h1>

    <div class="actions">
      <b-button type="is-primary" @click="handleCreate">
        Crear
      </b-button>
    </div>

    <p v-if="isLoading" class="loading">Cargando rutinas...</p>

    <div v-else class="routines-container">
      <div v-for="routine in routines" :key="routine._id" class="routine-card">
        <div class="card-header">
          {{ routine.name }}
        </div>

        <div class="card-content">
          <p v-for="(item, idx) in routine.exercises" :key="idx">
            • {{ item.exercise.name }} — {{ item.sets }}x{{ item.reps }}
          </p>
        </div>

        <div class="card-actions">
          <b-button size="is-small" type="is-info" @click="handleUpdate(routine)">Editar</b-button>
          <b-button size="is-small" type="is-danger" @click="handleDelete(routine)">Borrar</b-button>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 0">
      <b-button @click="prevPage" :disabled="page === 0"><<</b-button>
      <span class="page-number">{{ page + 1 }} / {{ totalPages }}</span>
      <b-button @click="nextPage" :disabled="page === totalPages - 1">>></b-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getAllRoutines, deleteRoutine } from '../../api/routine'
import { router } from '../../router'

export interface Routine {
  _id: string
  name: string
  exercises: {
    exercise: { _id: string; name: string }
    sets: number
    reps: number
  }[]
}

const isLoading = ref(true)
const routines = ref<Routine[]>([])
const limit = ref(5)
const skip = ref(0)
const page = ref(0)
const totalRoutines = ref(0)

const totalPages = computed(() => Math.ceil(totalRoutines.value / limit.value))

function nextPage() {
  page.value += 1
  skip.value += limit.value
}

function prevPage() {
  page.value -= 1
  skip.value -= limit.value
}

async function fetchRoutines() {
  const { success, data, errorCode } = await getAllRoutines(limit.value, skip.value)
  if (success) {
    routines.value = data.routines
    totalRoutines.value = data.totalRoutines
  } else {
    if (errorCode === 401) router.push('/unauthorized')
    else router.push('/not-found')
  }
}

function handleCreate() {
  router.push('/routines/create')
}

function handleUpdate(routine: Routine) {
  router.push(`/routines/update/${routine._id}`)
}

async function handleDelete(routine: Routine) {
  const confirmDelete = confirm(`¿Eliminar rutina "${routine.name}"?`)
  if (!confirmDelete) return

  const { success, error } = await deleteRoutine(routine._id)
  if (success) {
    await fetchRoutines()
    return
  } else {
    alert(`Ha ocurrido un error: ${error}`)
  }
}

onMounted(async () => {
  try {
    await fetchRoutines()
  } catch(error) {
    router.push('/not-found')
  } finally {
    isLoading.value = false
  }
})

watch(page, () => {
  fetchRoutines()
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.routines-section {
  max-width: 400px;
  margin: 0 auto;
  padding: 15px;
}

.title {
  text-align: center;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.loading {
  text-align: center;
  font-size: 1em;
}

.routines-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.routine-card {
  background: #2c2c2c;
  color: #f0f0f0; 
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
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.card-content p {
  margin: 5px 0;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 8px;
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
