<script setup lang="ts">
import { ref } from "vue";

const filter = ref("");
const emit = defineEmits(["getRestaurantsByName"]);
</script>

<template>
  <form @submit.prevent="emit('getRestaurantsByName', filter)" class="pure-form">
    <fieldset>
      <h2 class="big-text">Search by Name</h2>
      <input id="restaurant" type="text" v-model="filter" placeholder="Restaurant Name" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}

.big-text {
  font-size: xx-large;
}
</style>
