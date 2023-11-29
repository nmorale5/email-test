<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const email = ref("");

const createRestaurant = async (name: string, ) => {
  try {
    await fetchy("/api/business", "POST", {
      body: { name, email },
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
  email.value = "";
};
</script>

<template>
  <form @submit.prevent="createRestaurant(name)">
    <label for="name">Restaurant name:</label>
    <input id="name" v-model="name" placeholder="Restaurant Name" required/>
    <input id="email" v-model="email" placeholder="Owner Email" required/>
    <button type="submit" class="pure-button-primary pure-button">Create Restaurant</button>
    <p>Warning: An email will be sent to the address provided.</p>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
