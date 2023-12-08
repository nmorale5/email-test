<script setup lang="ts">
import { computed, ref } from "vue";

import { fetchy } from "../../utils/fetchy";

const props = defineProps(["petition"]);

const types = ["Accept", "Reject"];
const type = ref("Accept");
const typeSelection = computed(() => {
  if (type.value === "Accept") return 1;
  else return 0;
});
const response = ref("");

const createResponse = async () => {
  try {
    await fetchy("/api/response", "POST", {
      body: {
        concern: props.petition._id,
        response: response.value,
        type: typeSelection.value,
      },
    });
  } catch (_) {
    return;
  }
  //await router.push({ name: "Home" });
};
</script>

<template>
  <form @submit.prevent="createResponse">
    <label for="type">Type:</label>
    <select id="type" v-model="type">
      <option v-for="t in types" :value="type" :key="type">
        {{ t }}
      </option>
    </select>

    <label for="response">Response</label>
    <input id="response" v-model="response" placeholder="Write your response to the problem" autocomplete="off" required />

    <button type="submit" class="pure-button-primary pure-button">Create Response</button>
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

.selection:hover {
  background-color: darkgray;
}
</style>
