<script setup lang="ts">
import { ref } from "vue";

const search = ref("");
const emit = defineEmits(["getPetitionsByTitle"]);
</script>

<template>
  <form @submit.prevent="emit('getPetitionsByTitle', search)" class="pure-form">
    <fieldset>
      <legend>Search </legend>
      <input id="author" type="text" v-model="search" placeholder="Petition title" />
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
</style>