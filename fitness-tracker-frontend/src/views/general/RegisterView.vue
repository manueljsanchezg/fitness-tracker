<template>
  <div class="register-wrapper">
    <form class="register-form" @submit.prevent="submitForm">

      <h1>Regístrate</h1>

      <b-field 
      label="Nombre" 
      :type="registerError.nameValid.length ? 'is-danger' : ''"
      :message="registerError.nameValid"
      >
        <b-input v-model="registerUserData.name" maxlength="30"></b-input>
      </b-field>

      <b-field 
      label="Apellido"
      :type="registerError.surnameValid.length ? 'is-danger' : ''"
      :message="registerError.surnameValid"
      >
        <b-input v-model="registerUserData.surname" maxlength="30"></b-input>
      </b-field>

      <b-field 
      label="Email" 
      :type="registerError.emailValid.length ? 'is-danger' : ''"
      :message="registerError.emailValid"
      >
        <b-input v-model="registerUserData.email" maxlength="100"></b-input>
      </b-field>

      <b-field 
      label="Controseña" 
      :type="registerError.passwordValid.length ? 'is-danger' : ''"
      :message="registerError.passwordValid"
      >
        <b-input v-model="registerUserData.password" type="password" password-reveal maxlength="30"></b-input>
      </b-field>

      <b-message class="server-error" v-if="registerError.server?.length" type="is-danger">
        {{ registerError.server[0] }}
      </b-message>

      <div class="submit-button-container">
        <b-button native-type="submit" type="is-primary" :disabled="disabledButton">Enviar</b-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import z from 'zod'
import { registerUser } from '../../api/auth'
import { router } from '../../router'

const registerUserSchema = z.object({
  name: z.string().min(4, "Muy corto!").max(30, "Demasiado largo!").trim(),
  surname: z.string().min(4, "Muy corto!").max(30, "Demasiado largo!").trim(),
  email: z.email("Email inválido").max(100, "Muy corto!").trim(),
  password: z.string().min(4, "Muy corto!").max(30, "Demasiado largo!").trim()
})

export type RegisterUser = z.infer<typeof registerUserSchema>

interface RegisterError {
  nameValid: string[],
  surnameValid: string[],
  emailValid: string[],
  passwordValid: string[],
  server?: string[]
}

const registerUserData = ref<RegisterUser>({
  name: "",
  surname: "",
  email: "",
  password: ""
})

const registerError = ref<RegisterError>({
  nameValid: [],
  surnameValid: [],
  emailValid: [],
  passwordValid: [],
  server: []
})

const disabledButton = computed(() => {
  return !registerUserSchema.safeParse(registerUserData.value).success
})

watchEffect(() => {
  const result = registerUserSchema.safeParse(registerUserData.value)
  if (result.success) {
    registerError.value = {
      nameValid: [],
      surnameValid: [],
      emailValid: [],
      passwordValid: []
    }
  } else {
    const errors = z.flattenError(result.error)
    registerError.value.nameValid = errors.fieldErrors.name ?? []
    registerError.value.surnameValid = errors.fieldErrors.surname ?? []
    registerError.value.emailValid = errors.fieldErrors.email ?? []
    registerError.value.passwordValid = errors.fieldErrors.password ?? []
  }
})

async function submitForm() {
  if (!registerUserSchema.safeParse(registerUserData.value).success) {
    return
  }
  const { success, error } = await registerUser(registerUserData.value)
  if (!success && error) {
    registerError.value.server = [error]
  } else {
    router.push('/login')
  }
}

</script>

<style scoped>
h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.register-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.register-form {
  width: 80%;
}

.submit-button-container {
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
