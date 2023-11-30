<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import CreatePetitionForm from "../components/Petition/CreatePetitionForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());


</script>

<template>
  <CreatePetitionForm />
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
