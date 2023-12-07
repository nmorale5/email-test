<script setup lang="ts">
import PetitionListComponent from "@/components/Petition/PetitionListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import VerificationForm from "../components/Restaurant/VerificationForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

import { fetchy } from "../utils/fetchy";

const sendRegisterEmail = async () => {
  try {
    await fetchy(`/api/email/testRegister`, "GET");
  } catch (e) {
    return;
  }
};

const sendThresholdEmail = async () => {
  try {
    await fetchy(`/api/email/testThreshold`, "GET");
  } catch (e) {
    return;
  }
};
</script>

<template>
  <main>
    <section>
      <!-- <button @click="sendRegisterEmail">Send Register Email</button> -->
      <!-- <button @click="sendThresholdEmail">Send Threshold Email</button> -->
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <VerificationForm class="pad-left-big"/>
    <PetitionListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.pad-left-big {
  padding-left: 5cm;
}
</style>
