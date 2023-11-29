<script setup lang="ts">
import CreateRestaurant from "@/components/Petition/CreateRestaurant.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());


</script>

<template>
  <CreateRestaurant />
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
