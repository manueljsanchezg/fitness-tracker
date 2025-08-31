<template>
  <div class="workoutlog-wrapper">

    <p v-if="isLoading" class="loading">Cargando...</p>

    <form v-else class="workoutlog-form" @submit.prevent="submitForm">

      <h1>Crear Workout Log</h1>

      <b-field label="Ejercicio"
               :type="workoutLogError.exerciseValid.length ? 'is-danger' : ''"
               :message="workoutLogError.exerciseValid[0]">
        <b-autocomplete
          placeholder="Busca un ejercicio"
          v-model="workoutLogData.name"
          :data="filteredExercisesList"
          field="name"
          clearable
          @select="(option: Exercise) => {
              workoutLogData.exerciseId = option._id
              workoutLogData.name = option.name
            }"
        ></b-autocomplete>
      </b-field>

      <b-field label="Sets"
               :type="workoutLogError.setsValid.length ? 'is-danger' : ''"
               :message="workoutLogError.setsValid[0]">
        <b-input type="number" v-model.number="workoutLogData.sets" min="1"></b-input>
      </b-field>

      <b-field label="Reps"
               :type="workoutLogError.repsValid.length ? 'is-danger' : ''"
               :message="workoutLogError.repsValid[0]">
        <b-input type="number" v-model.number="workoutLogData.reps" min="1"></b-input>
      </b-field>

      <b-field label="Peso (kg)"
               :type="workoutLogError.weightValid.length ? 'is-danger' : ''"
               :message="workoutLogError.weightValid[0]">
        <b-input type="number" v-model.number="workoutLogData.weight" min="1"></b-input>
      </b-field>

      <b-field label="Fecha"
               :type="workoutLogError.dateValid.length ? 'is-danger' : ''"
               :message="workoutLogError.dateValid[0]">
        <b-input type="date" v-model="workoutLogData.date"></b-input>
      </b-field>

      <b-message class="server-error" v-if="workoutLogError.server?.length" type="is-danger">
        {{ workoutLogError.server[0] }}
      </b-message>

      <div class="submit-button-container">
        <b-button native-type="submit" type="is-primary" :disabled="disabledButton">Crear</b-button>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import z from 'zod'
import { router } from '../../router'
import { type Exercise } from '../general/ExercisesView.vue'
import { getAllExercises } from '../../api/exercise'
import { createWorkoutLog } from '../../api/workoutlog'

const workoutLogSchema = z.object({
  exerciseId: z.string().min(1, "Ejercicio requerido"),
  name: z.string().min(1, "Ejercicio requerido"),
  sets: z.number("Debe ser un número").min(1, "Al menos 1 set"),
  reps: z.number("Debe ser un número").min(1, "Al menos 1 repetición"),
  weight: z.number("Debe ser un número").min(0, "Peso no puede ser negativo"),
  date: z.string().min(1, "Fecha requerida")
})

export type WorkoutLog = z.infer<typeof workoutLogSchema>

interface WorkoutLogError {
  exerciseValid: string[],
  setsValid: string[],
  repsValid: string[],
  weightValid: string[],
  dateValid: string[],
  server?: string[]
}

const isLoading = ref(true)
const exercises = ref<Exercise[]>([])

const workoutLogData = ref<WorkoutLog>({
  exerciseId: "",
  name: "",
  sets: 1,
  reps: 1,
  weight: 1,
  date: new Date().toISOString().split("T")[0]
})

const workoutLogError = ref<WorkoutLogError>({
  exerciseValid: [],
  setsValid: [],
  repsValid: [],
  weightValid: [],
  dateValid: [],
  server: []
})

const disabledButton = computed(() => !workoutLogSchema.safeParse(workoutLogData.value).success)

async function fetchExercises() {
  const { success, data, errorCode } = await getAllExercises()
  if (success) exercises.value = data.exercises
  else {
    if (errorCode === 401) router.push('/unauthorized')
    else router.push('/not-found')
  }
}

onMounted(async () => {
  try { 
    await fetchExercises() 
  } catch { 
    router.push('/not-found') 
  } finally { 
    isLoading.value = false 
  }
})

watchEffect(() => {
  const result = workoutLogSchema.safeParse(workoutLogData.value)

  if (result.success) {
    workoutLogError.value = { exerciseValid: [], setsValid: [], repsValid: [], weightValid: [], dateValid: [], server: [] }
  } else {
    const errors = z.flattenError(result.error)
    workoutLogError.value.exerciseValid = errors.fieldErrors.exerciseId ?? []
    workoutLogError.value.setsValid = errors.fieldErrors.sets ?? []
    workoutLogError.value.repsValid = errors.fieldErrors.reps ?? []
    workoutLogError.value.weightValid = errors.fieldErrors.weight ?? []
    workoutLogError.value.dateValid = errors.fieldErrors.date ?? []
  }
})

const filteredExercisesList = computed(() => {
  const val = workoutLogData.value.name || ""
  return exercises.value.filter(e =>
    e.name.toLowerCase().includes(val.toLowerCase())
  )
})

async function submitForm() {
  if (!workoutLogSchema.safeParse(workoutLogData.value).success) return
  const { success, error } = await createWorkoutLog(workoutLogData.value)
  if (!success && error) workoutLogError.value.server = [error]
  else router.push('/workoutlogs')
}

</script>

<style scoped>
.workoutlog-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.workoutlog-form {
  width: 80%;
}

.submit-button-container {
  margin-top: 25px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
}

.server-error {
  font-size: 14px;
  margin-top: 10px;
}

.loading {
  text-align: center;
  font-size: 1em;
}
</style>
