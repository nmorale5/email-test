<script setup lang="ts">
import PetitionListComponent from "@/components/Petition/PetitionListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import CreatePetitionForm from "../components/Petition/CreatePetitionForm.vue";
import FeaturedPetition from "../components/Petition/FeaturedPetition.vue";
import router from "../router";
import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const isFormOnScreen = ref(false);

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

const goToLogin = () => {
  void router.push({ name: "Login" });
}
</script>

<template>
  <main>
    <div class="shadow" v-if="isFormOnScreen"></div>
    <h2><i>Big changes start just one petition at a time.</i></h2>
    <FeaturedPetition />
    <div v-if="!isLoggedIn" class="create-petition-button" v-on:click="goToLogin">
      <h1 class="create-petition-text">Log in to Start a Petition!</h1>
    </div>
    <div v-else class="create-petition-button" @click="isFormOnScreen = true">
      <h1 class="create-petition-text">Create a Petition</h1>
    </div>
    <div v-if="isFormOnScreen" class="popup">
      <div class="component">
        <button class="close-button" @click="isFormOnScreen = false">
          <i class="fas fa-times"></i>
        </button>
        <CreatePetitionForm
          @formSubmitted="
            isFormOnScreen = false;
            $router.go(0)
          "
        />
      </div>
    </div>
    <PetitionListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

h2 {
  text-align: center;
}

.pad-left-big {
  padding-left: 5cm;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  margin-top: 0%;
}

.shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Black color with 50% opacity */
  /* pointer-events: all; */
}

.component {
  position: relative;
  /* Other styles for your component */
}

.close-button {
  position: absolute;
  top: -15px;
  right: -15px;
  border: none;
  border-radius: 50%;
  background-color: #ccc;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-button i {
  color: #fff;
}

.create-petition-button {
  display: block;
  margin: 0 auto;
  margin-top: 1em;
  background-color: var(--blue);
  width: 30%;
  border-radius: 5px;
  color: white;
}

.create-petition-button:hover {
  background-color: var(--blue-dark);
}

.create-petition-text {
  font-size: 32pt;
  font-weight: bold;
}

.create-petition-text:hover {
  cursor: pointer;
}
</style>
