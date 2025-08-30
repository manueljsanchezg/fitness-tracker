<template>
    <div class="exercise-wrapper">
        <p v-if="isLoading" class="loading">Cargando ejercicios...</p>

        <form v-else class="exercise-form" @submit.prevent="submitForm">

            <h1>Update Exercise</h1>

            <b-field label="Nombre" :type="exerciseError.nameValid.length ? 'is-danger' : ''"
                :message="exerciseError.nameValid">
                <b-input v-model="exerciseData.name" maxlength="100"></b-input>
            </b-field>

            <b-field label="Músculos involucrados (separados por coma)"
                :type="exerciseError.musclesValid.length ? 'is-danger' : ''" :message="exerciseError.musclesValid">
                <b-input v-model="musclesInput" maxlength="200"></b-input>
            </b-field>

            <b-message class="server-error" v-if="exerciseError.server?.length" type="is-danger">
                {{ exerciseError.server[0] }}
            </b-message>

            <div class="submit-button-container">
                <b-button native-type="submit" type="is-primary" :disabled="disabledButton">Actualizar</b-button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import z from 'zod'
import { getExercise, updateExercise } from '../../api/exercise'
import { router } from '../../router'
import { useRoute } from 'vue-router'
import { da } from 'zod/locales'

const route = useRoute()

const { id } = route.params as { id: string }

const exerciseSchema = z.object({
    name: z.string().min(1, "Name can't be empty").max(100, "Too long!").trim(),
    muscles_involved: z.array(z.string().min(1)).nonempty("At least one muscle required")
})

export type Exercise = z.infer<typeof exerciseSchema>

interface ExerciseError {
    nameValid: string[],
    musclesValid: string[],
    server?: string[]
}

const isLoading = ref<boolean>(true)

const exerciseData = ref<Exercise>({
    name: "",
    muscles_involved: []
})

const musclesInput = ref("")

const exerciseError = ref<ExerciseError>({
    nameValid: [],
    musclesValid: [],
    server: []
})

const disabledButton = computed(() => {
    return !exerciseSchema.safeParse(exerciseData.value).success
})

async function fetchExercise() {
    const { success, data, errorCode } = await getExercise(id)
    console.log(data)
    if (success) {
        exerciseData.value.name = data.name
        exerciseData.value.muscles_involved = data.muscles_involved
        musclesInput.value = data.muscles_involved.join(", ")
    } else {
        if (errorCode === 401) router.push('/unauthorized')
        else if (errorCode === 404) router.push('/not-found')
        else router.push('/not-found')
    }
}

onMounted(async () => {
    try {
        await fetchExercise()
    } finally {
        isLoading.value = false
    }
})

watchEffect(() => {
    if (musclesInput.value) {
        exerciseData.value.muscles_involved = musclesInput.value
            .split(",")
            .map(m => m.trim())
            .filter(m => m.length > 0)
    }

    const result = exerciseSchema.safeParse(exerciseData.value)
    if (result.success) {
        exerciseError.value = {
            nameValid: [],
            musclesValid: [],
            server: []
        }
    } else {
        const errors = z.flattenError(result.error)
        exerciseError.value.nameValid = errors.fieldErrors.name ?? []
        exerciseError.value.musclesValid = errors.fieldErrors.muscles_involved ?? []
    }
})

async function submitForm() {
    if (!exerciseSchema.safeParse(exerciseData.value).success) {
        return
    }
    const { success, error } = await updateExercise(id, exerciseData.value)
    if (!success && error) {
        exerciseError.value.server = [error]
    } else {
        router.push('/exercises')
    }
}
</script>

<style scoped>
h1 {
    font-size: 36px;
    margin-bottom: 10px;
}

.exercise-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.exercise-form {
    width: 80%;
}

.submit-button-container {
    margin-top: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.server-error {
    font-size: 14px
}
</style>
