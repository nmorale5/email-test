<script setup lang="ts">
import BadgeList from "@/components/Badges/BadgeList.vue";
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
  void router.push({ name: "Restaurant", params: { id: props.restaurant._id } });
}

async function getRestaurantBadges() {
  try {
    badges.value = await fetchy(`/api/badges/${props.restaurant._id}`, "GET");
    console.log("Got badges")
    console.log(badges.value)
  } catch {
    console.log("Error with getting badges")
    return;
  }
}

onBeforeMount(getRestaurantBadges);
</script>

<template>
  <button v-on:click="navigateToRestaurant" class="restaurant-button">
    <strong>{{ props.restaurant.name }}</strong>
    <BadgeList :badges="badges" />
  </button>
</template>

<style scoped>
p {
  margin: 0em;
}

.restaurant-button {
  color: var(--black);
  border-radius: 3px;
  border-color: var(--black);
  border-width: 2px;
}
</style>
