<template>
  <section class="profile">
    <h3 v-if="isLoading" class="loading">Cargando...</h3>

    <div v-else class="profile-card">
      <section class="profile-info">
        <p class="welcome">Hola, bienvenido a tu perfil</p>

        <div class="profile-field">
          <span class="label">Nombre:</span>
          <span class="value">{{ profileData.name }}</span>
        </div>

        <div class="profile-field">
          <span class="label">Apellido:</span>
          <span class="value">{{ profileData.surname }}</span>
        </div>

        <div class="profile-field">
          <span class="label">Email:</span>
          <span class="value">{{ profileData.email }}</span>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getMyProfile } from '../../api/user';
import { router } from '../../router';

interface ProfileData {
  name: string,
  surname: string,
  email: string
}

const isLoading = ref(true)

const profileData = ref<ProfileData>({
  name: "",
  surname: "",
  email: "",
})

onMounted(async () => {
  try {
    const { success, data, errorCode } = await getMyProfile()

    if (!success && errorCode) {
      switch (errorCode) {
        case 404:
          return router.push('/not-found')
        case 401:
          return router.push('/unauthorized')
      }
    } else {
      profileData.value = data
    }
  } catch {
    router.push('/not-found')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.profile {
  max-width: 400px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-card {
  background: #2c2c2c;
  color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.profile-field {
  display: flex;
  gap: 0.5rem;
}

.label {
  color: #f0f0f0; 
  font-weight: bold;
}

.value {
  color: #d3d3d3;
}

.loading {
  text-align: center;
  font-size: 1.1rem;
  margin-top: 3rem;
}

.welcome {
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
