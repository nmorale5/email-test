<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import router from "../../router/index";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["restaurant"]);
const lastChange: any = ref({})
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
  } catch {
    return;
  }
}

async function getResponse() {
    //Get last response for restaurant
}

onBeforeMount(async () => {
    await getRestaurantBadges();
    await getResponse();
});
</script>

<template>
  <button v-on:click="navigateToRestaurant">
    <div>
        <strong>{{ props.restaurant.name }}</strong>
        <BadgeList :badges="badges" />
    </div>
    <div>
        <p>Review their new changes with {{lastChange.petition.topic}} food</p>
    </div>
  </button>
</template>

<style scoped>
p {
  margin: 0em;
}
</style>