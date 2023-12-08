<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import PromotedRestaurantComponent from "./PromotedRestaurantComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const restaurants:any = ref([]);

async function getRestaurants(search?: string) {
  //Get restaurants in feedback state
}

onBeforeMount(async () => {
  await getRestaurants();
  loaded.value = true;
});
</script>

<template>
  <h1>Trending Restaurants</h1>
  <PromotedRestaurantComponent v-for="restaurant in restaurants" :restaurant="restaurant"/>
</template>

<style scoped>
</style>