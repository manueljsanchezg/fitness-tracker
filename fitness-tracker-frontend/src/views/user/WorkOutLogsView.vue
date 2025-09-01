<template>
  <section class="workoutlogs-section">
    <h1 class="title">Mis Workout Logs</h1>

    <div class="actions">
      <b-button type="is-primary" @click="handleCreate">
        Crear
      </b-button>
    </div>

    <p v-if="isLoading" class="loading">Cargando registros...</p>

    <div v-else class="workoutlogs-container">
      <div v-for="workoutlog in workoutlogs" :key="workoutlog._id" class="workoutlog-card">
        <div class="card-header">
          {{ workoutlog.exercise.name }}
        </div>

        <div class="card-content">
          <p>
            • {{ workoutlog.sets }}x{{ workoutlog.reps }} — {{ workoutlog.weight }} kg
          </p>
          <p class="date">
            📅 {{ new Date(workoutlog.date).toLocaleDateString() }}
          </p>
        </div>

        <div class="card-actions">
          <b-button size="is-small" type="is-info" @click="handleUpdate(workoutlog)">Editar</b-button>
          <b-button size="is-small" type="is-danger" @click="handleDelete(workoutlog)">Borrar</b-button>
        </div>
      </div>
    </div>

    <div class="pagination"  v-if="totalPages > 0">
      <b-button @click="prevPage" :disabled="page === 0"><<</b-button>
      <span class="page-number">{{ page + 1 }} / {{ totalPages }}</span>
      <b-button @click="nextPage" :disabled="page === totalPages - 1">>></b-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getMyWorkOutLogs, deleteWorkoutlog } from '../../api/workoutlog'
import { router } from '../../router'

export interface WorkoutLog {
  _id: string
  exercise: { _id: string; name: string }
  sets: number
  reps: number
  weight: number
  date: string
}

const isLoading = ref(true)
const workoutlogs = ref<WorkoutLog[]>([])
const limit = ref(5)
const skip = ref(0)
const page = ref(0)
const totalWorkoutLogs = ref(0)

const totalPages = computed(() => Math.ceil(totalWorkoutLogs.value / limit.value))

function nextPage() {
  page.value += 1
  skip.value += limit.value
}

function prevPage() {
  page.value -= 1
  skip.value -= limit.value
}

async function fetchWorkoutLogs() {
  const { success, data, errorCode } = await getMyWorkOutLogs(limit.value, skip.value)
  if (success) {
    workoutlogs.value = data.workOutLogs
    totalWorkoutLogs.value = data.totalWorkOutLogs
  } else {
    if (errorCode === 401) router.push('/unauthorized')
    else router.push('/not-found')
  }
}

function handleCreate() {
  router.push('/workoutlogs/create')
}

function handleUpdate(workoutlog: WorkoutLog) {
  router.push(`/workoutlogs/update/${workoutlog._id}`)
}

async function handleDelete(workoutlog: WorkoutLog) {
  const confirmDelete = confirm(`¿Eliminar registro de "${workoutlog.exercise.name}"?`)
  if (!confirmDelete) return

  const { success, error } = await deleteWorkoutlog(workoutlog._id)
  if (success) {
    await fetchWorkoutLogs()
    return
  } else {
    alert(`Ha ocurrido un error: ${error}`)
  }
}

onMounted(async () => {
  try {
    await fetchWorkoutLogs()
  } catch (error) {
    router.push('/not-found')
  } finally {
    isLoading.value = false
  }
})

watch(page, () => {
  fetchWorkoutLogs()
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.workoutlogs-section {
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

.workoutlogs-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workoutlog-card {
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

.card-content .date {
  font-size: 0.85em;
  color: #bbb;
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
