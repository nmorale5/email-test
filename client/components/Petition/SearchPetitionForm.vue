<script setup lang="ts">
import { ref } from "vue";

const search = ref("");
const emit = defineEmits(["getPetitionsByTitle"]);
</script>

<template>
  <form @submit.prevent="emit('getPetitionsByTitle', search)" class="pure-form">
    <fieldset>
      <input id="author" type="text" v-model="search" placeholder="Search Petitions" />
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
