<script setup lang="ts">
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["restaurant"]);
const badges = ref(
  new Array<{
    name: string;
    count: number;
  }>(),
);

async function navigateToRestaurant() {
  void router.push({ name: 'Restaurant', params: { param: props.restaurant._id } });
}

async function getRestaurantBadges() {
  try {
    badges.value = await fetchy(`/api/badges/${props.restaurant._id}`, "GET");
  } catch {
    return;
  }
}

onBeforeMount(getRestaurantBadges);
</script>
<template>
  <button v-on:click="navigateToRestaurant">
    <strong>{{ props.restaurant.name }}</strong>
    <ul>
      Badges:
      <p v-if="badges.length === 0"><em>None</em></p>
      <li v-else v-for="badge in badges" :key="badge.name">{{ badge.name }} x{{ badge.count }}</li>
    </ul>
  </button>
</template>

<style scoped>
p {
  margin: 0em;
}
</style>
