import { defineStore } from "pinia"
import { ref } from "vue"

export const useAuthStore = defineStore('auth', () => {
    const email = ref<string>("")
    const role = ref<string>("")

    return { email, role}
})