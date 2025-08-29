<template>
  <div class="login-wrapper">
    <form class="login-form" @submit.prevent="submitForm">

      <h1>Login</h1>

      <b-field label="Email" :type="loginError.emailValid.length ? 'is-danger' : ''" :message="loginError.emailValid">
        <b-input v-model="loginUserData.email" maxlength="100"></b-input>
      </b-field>

      <b-field label="Password" :type="loginError.passwordValid.length ? 'is-danger' : ''"
        :message="loginError.passwordValid">
        <b-input v-model="loginUserData.password" type="password" password-reveal maxlength="30"></b-input>
      </b-field>

      <b-message class="server-error" v-if="loginError.server?.length" type="is-danger">
        {{ loginError.server[0] }}
      </b-message>

      <RouterLink to="/register">Don't have an account yet?</RouterLink>

      <div class="submit-button-container">
        <b-button native-type="submit" type="is-primary" :disabled="disabledButton">Enviar</b-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import z from 'zod'
import { loginUser } from '../api/auth'
import { router } from '../router'
import { useAuthStore } from '../store/authStore'
import { scheduleTokenRefresh } from '../utils/utils'

const authStore = useAuthStore()

const loginUserSchema = z.object({
  email: z.email().max(100, "Too long!").trim(),
  password: z.string().min(1, "Can't be empty").trim()
})

export type LoginUser = z.infer<typeof loginUserSchema>

interface LoginError {
  emailValid: string[],
  passwordValid: string[],
  server?: string[]
}

const loginUserData = ref<LoginUser>({
  email: "",
  password: ""
})

const loginError = ref<LoginError>({
  emailValid: [],
  passwordValid: [],
  server: []
})

const disabledButton = computed(() => {
  return !loginUserSchema.safeParse(loginUserData.value).success
})

watchEffect(() => {
  const result = loginUserSchema.safeParse(loginUserData.value)
  if (result.success) {
    loginError.value = {
      emailValid: [],
      passwordValid: [],
      server: []
    }
  } else {
    const errors = z.flattenError(result.error)
    loginError.value.emailValid = errors.fieldErrors.email ?? []
    loginError.value.passwordValid = errors.fieldErrors.password ?? []
  }
})

async function submitForm() {
  if (!loginUserSchema.safeParse(loginUserData.value).success) {
    return
  }
  const { success, error, data } = await loginUser(loginUserData.value)
  if (!success && error) {
    loginError.value.server = [error]
  } else {
    if (data.expiresIn) scheduleTokenRefresh(data.expiresIn)
    authStore.email = data.email
    authStore.role = data.role
    router.push('/home')
  }
}

</script>

<style scoped>
h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.login-form {
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
