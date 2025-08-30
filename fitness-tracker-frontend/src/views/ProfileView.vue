<template>
  <section class="profile">
    <h3 v-if="isLoading" class="loading">Cargando...</h3>

    <b-card v-else class="profile-card" :header="profileData.name + ' ' + profileData.surname">
      <section class="profile-info">
        <p class="welcome">👋 Hola, bienvenido a tu perfil</p>

        <b-field label="Nombre">
          <b-icon icon="account" size="is-small"></b-icon>
          <span>{{ profileData.name }}</span>
        </b-field>

        <b-field label="Apellido">
          <b-icon icon="account-circle" size="is-small"></b-icon>
          <span>{{ profileData.surname }}</span>
        </b-field>

        <b-field label="Email">
          <b-icon icon="email" size="is-small"></b-icon>
          <span>{{ profileData.email }}</span>
        </b-field>
      </section>
    </b-card>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getMyProfile } from '../api/user';
import { router } from '../router';

interface ProfileData {
  name: string,
  surname: string,
  email: string
}

const isLoading = ref<boolean>(true)

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
      profileData.value.name = data.name
      profileData.value.surname = data.surname
      profileData.value.email = data.email
    }
  } catch (error) {
    return router.push('/not-found')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.profile {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.profile-card {
  max-width: 500px;
  width: 100%;
  border-radius: 12px;
}

.profile-info {
  padding: 1rem;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 3rem;
}

.welcome {
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>

