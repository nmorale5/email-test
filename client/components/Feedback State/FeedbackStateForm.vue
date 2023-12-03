<script setup lang="ts">
import { ref } from "vue";

const rating = ref(1);
const effectiveness = ref(0);


const updateRating = async () => {
    // check if there already exists a rating
    // If not, create a new rating
    // If so, update the rating
}

const getEffectiveness = async () => {
    //route for getting rating
}
</script>

<template>
    <div>
        <i>Effectiveness: {{ effectiveness }}</i>
    </div>
    <label class="rating-label">
        <strong>Your Rating: </strong>
        <input
            class="rating"
            max="5"
            oninput="this.style.setProperty('--value', this.value)"
            step="0.5"
            type="range"
            v-model="rating"
            @click="updateRating">
    </label>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>