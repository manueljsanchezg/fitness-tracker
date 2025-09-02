<template>
    <div class="routine-wrapper">

        <p v-if="isLoading" class="loading">Cargando...</p>

        <form v-else class="routine-form" @submit.prevent="submitForm">

            <h1>Crear Rutina</h1>

            <b-field label="Nombre de la rutina" :type="routineError.nameValid.length ? 'is-danger' : ''"
                :message="routineError.nameValid">
                <b-input v-model="routineData.name" maxlength="100"></b-input>
            </b-field>

            <div v-for="(exercise, index) in routineData.exercises" :key="index" class="exercise-item">
                <h3>Ejercicio {{ index + 1 }}</h3>

                <b-field label="Ejercicio"
                    :type="routineError.exercisesValid[index]?.exercise?.length ? 'is-danger' : ''"
                    :message="routineError.exercisesValid[index]?.exercise?.[0]">
                    <b-autocomplete
                        placeholder="Busca un ejercicio"
                        v-model="routineData.exercises[index].name"
                        :data="filteredExercisesList[index]"
                        field="name"
                        clearable
                        @select="(option: Exercise) => {
                            routineData.exercises[index].exercise = option._id
                            routineData.exercises[index].name = option.name
                            }"
                    ></b-autocomplete>
                </b-field>

                <b-field label="Sets" :type="routineError.exercisesValid[index]?.sets?.length ? 'is-danger' : ''"
                    :message="routineError.exercisesValid[index]?.sets?.[0]">
                    <b-input type="number" v-model.number="exercise.sets" min="1"></b-input>
                </b-field>

                <b-field label="Reps" :type="routineError.exercisesValid[index]?.reps?.length ? 'is-danger' : ''"
                    :message="routineError.exercisesValid[index]?.reps?.[0]">
                    <b-input type="number" v-model.number="exercise.reps" min="1"></b-input>
                </b-field>

                <b-button type="is-danger" size="is-small" @click.prevent="removeExercise(index)">Eliminar</b-button>
                <hr>
            </div>

            <b-button type="is-info" size="is-small" @click.prevent="addExercise">Agregar ejercicio</b-button>

            <b-message class="server-error" v-if="routineError.server?.length" type="is-danger">
                {{ routineError.server[0] }}
            </b-message>

            <div class="submit-button-container">
                <b-button native-type="submit" type="is-primary" :disabled="disabledButton">Crear</b-button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import z from 'zod'
import { createRoutine } from '../../api/routine'
import { router } from '../../router'
import { type Exercise } from '../general/ExercisesView.vue'
import { getAllExercises } from '../../api/exercise'

const routineSchema = z.object({
    name: z.string().min(1, "Nombre no puede estar vacío").max(100, "Demasiado largo!").trim(),
    exercises: z.array(
        z.object({
            exercise: z.string().min(1, "Ejercicio requerido"),
            name: z.string().min(1, "Ejercicio requerido"),
            sets: z.number().min(1, "Al menos 1 set"),
            reps: z.number().min(1, "Al menos 1 repetición")
        })
    ).nonempty("Al menos un ejercicio es requerido")
})

export type Routine = z.infer<typeof routineSchema>

interface RoutineError {
    nameValid: string[],
    exercisesValid: { exercise?: string[], sets?: string[], reps?: string[] }[],
    server?: string[]
}

const isLoading = ref(true)
const exercises = ref<Exercise[]>([])
const routineData = ref<Routine>({ name: "", exercises: [] })

const routineError = ref<RoutineError>({
    nameValid: [], exercisesValid: [], server: []
})

const disabledButton = computed(() => !routineSchema.safeParse(routineData.value).success)

const filteredExercisesList = computed(() => {
  return routineData.value.exercises.map((ex, _index) => {
    const val = ex.name || ""
    return exercises.value.filter(e =>
      e.name.toLowerCase().includes(val.toLowerCase())
    )
  })
})

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
  const result = routineSchema.safeParse(routineData.value)
  console.log(filteredExercisesList.value)
  if (result.success) {
    routineError.value = { nameValid: [], exercisesValid: [], server: [] }
  } else {
    const errors = z.flattenError(result.error)

    routineError.value.nameValid = errors.fieldErrors.name ?? []
  }
})


function addExercise() {
    routineData.value.exercises.push({ name: "", exercise: "", sets: 1, reps: 1 })
}
function removeExercise(idx: number) {
    routineData.value.exercises.splice(idx, 1)
}


async function submitForm() {
    if (!routineSchema.safeParse(routineData.value).success) return
    const { success, error } = await createRoutine(routineData.value)
    if (!success && error) routineError.value.server = [error]
    else router.push('/routines')
}
</script>

<style scoped>
.routine-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.routine-form {
    width: 80%;
}

.exercise-item {
    margin-bottom: 15px;
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
</style>
