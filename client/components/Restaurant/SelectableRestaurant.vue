<script setup lang="ts">
import router from "@/router";

const props = defineProps(["restaurant"]);

async function navigateToRestaurant() {
  void router.push({ name: "Home" });
}

</script>
<template>
  <button v-on:click="navigateToRestaurant">{{ props.restaurant.name }}</button>
</template>

<style scoped>
p {
  margin: 0em;
}
</style>
