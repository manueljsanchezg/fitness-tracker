<template>
  <section class="home-container">
    <h1>¡Bienvenido, {{ authStore.email }}!</h1>
    <p>En tu panel puedes ver tu progreso, tus rutinas y tu historial de ejercicios.</p>

    <div class="info-section">
      <p><strong>Rutinas activas:</strong> 3</p>
      <p><strong>Historial de peso:</strong> Peso promedio esta semana: 70 kg</p>
      <p><strong>Máximo peso levantado esta semana</strong> 100 kg</p>
    </div>

    <p class="note">Usa el sidebar para navegar entre tus rutinas e historial.</p>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../store/authStore';

const authStore = useAuthStore()
</script>

<style scoped>
.home-container {
  padding: 20px;
  line-height: 1.6;
}

h1 {
  margin-bottom: 10px;
  font-size: 2rem;
}

.info-section {
  margin-top: 20px;
}

.note {
  margin-top: 30px;
  color: #555;
  font-style: italic;
}
</style>