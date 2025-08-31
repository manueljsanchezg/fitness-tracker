<template>
  <section class="exercises-section">
    <h1 class="title">Mis Ejercicios</h1>

    <div v-if="authStore.role === 'admin'" class="actions">
      <b-button type="is-primary" @click="handleCreate">
        Crear
      </b-button>
    </div>

    <p v-if="isLoading" class="loading">Cargando ejercicios...</p>

    <div v-else class="exercises-container">
      <div v-for="exercise in exercises" :key="exercise._id" class="exercise-card">
        <div class="card-header">
          {{ exercise.name }}
        </div>

        <div class="card-content">
          <p>Músculos: {{ exercise.muscles_involved.join(', ') }}</p>
        </div>

        <div v-if="authStore.role === 'admin'" class="card-actions">
          <b-button size="is-small" type="is-info" @click="handleUpdate(exercise)">Editar</b-button>
          <b-button size="is-small" type="is-danger" @click="handleDelete(exercise)">Borrar</b-button>
        </div>
      </div>
    </div>

    <div class="pagination">
      <b-button @click="prevPage" :disabled="page === 0">Prev</b-button>
      <span class="page-number">{{ page + 1 }} / {{ totalPages }}</span>
      <b-button @click="nextPage" :disabled="page === totalPages - 1">Next</b-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { deleteExercise, getAllExercises } from '../../api/exercise'
import { router } from '../../router'
import { useAuthStore } from '../../store/authStore'

const authStore = useAuthStore()

export interface Exercise {
  _id: string
  name: string
  muscles_involved: string[]
}

const isLoading = ref(true)
const exercises = ref<Exercise[]>([])
const limit = ref(5)
const skip = ref(0)
const page = ref(0)
const totalExercises = ref(0)

const totalPages = computed(() => Math.ceil(totalExercises.value / limit.value))

function nextPage() {
  page.value += 1
  skip.value += limit.value
}

function prevPage() {
  page.value -= 1
  skip.value -= limit.value
}

async function fetchExercises() {
  const { success, data, errorCode } = await getAllExercises(limit.value, skip.value)
  if (success) {
    exercises.value = data.exercises
    totalExercises.value = data.totalExercises
  } else {
    if (errorCode === 401) router.push('/unauthorized')
    else router.push('/not-found')
  }
}

function handleCreate() {
  router.push('/exercises/create')
}

function handleUpdate(exercise: Exercise) {
  router.push(`/exercises/update/${exercise._id}`)
}

async function handleDelete(exercise: Exercise) {
  const confirmDelete = confirm(`¿Eliminar ejercicio "${exercise.name}"?`)
  if (!confirmDelete) return

  const { success, error } = await deleteExercise(exercise._id)
  if (success) {
    await fetchExercises()
    return
  } else {
    alert(`Ha ocurrido un error: ${error}`)
  }

}

onMounted(async () => {
  try {
    await fetchExercises()
  } catch(error) {
    router.push('/not-found')
  } finally {
    isLoading.value = false
  }
})

watch(page,
  () => {
    fetchExercises()
    window.scrollTo(0, 0)
  })
</script>

<style scoped>
.exercises-section {
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

.exercises-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercise-card {
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
