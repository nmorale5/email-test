<script setup lang="ts">
import Restaurant from "@/components/Restaurant/Restaurant.vue";
import { onBeforeMount, ref } from "vue";
import router from "../router";
import { fetchy } from "../utils/fetchy";

const restaurant = ref();
const petitions = ref();
const badges = ref();
const loaded = ref(false);

onBeforeMount(async () => {
  const restaurantId = router.currentRoute.value.params.id;
  try {
    restaurant.value = await fetchy(`/api/business/id/${restaurantId}`, "GET");
    petitions.value = await fetchy(`/api/business/${restaurantId}/petitions/approved`, "GET");
    badges.value = await fetchy(`/api/badges/${restaurantId}`, "GET");
    loaded.value = true;
  } catch {
    return;
  }
});
</script>

<template>
  <h2 v-if="!loaded">loading...</h2>
  <Restaurant v-else :restaurant="restaurant" :petitions="petitions" :badges="badges" />
</template>

<style scoped>
h1 {
  text-align: center;
}

.pad {
  margin-top: 100px;
}
</style>
