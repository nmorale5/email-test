<script setup lang="ts">
import Restaurant from "@/components/Restaurant/Restaurant.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());


</script>

<template>
  <Restaurant />
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
