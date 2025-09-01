import { defineStore } from "pinia"
import { ref } from "vue"

export const useAuthStore = defineStore('auth', () => {
    const email = ref<string>("")
    const role = ref<string>("")

    function logout() {
        email.value = ""
        role.value = ""
  }

    return { email, role, logout }
})