<script setup lang="ts">
import Restaurants from "@/components/Restaurant/Restaurants.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());


</script>

<template>
  <Restaurants />
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
