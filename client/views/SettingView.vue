<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="fall">
    <div class="circle green">
      <h2>You are currently logged in as:<br/> {{ currentUsername }}</h2>
      <button class="pure-button pure-button-primary pad" @click="logout">Logout</button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  padding-top: 5%;
}

h2 {
  text-align: center;
}

.fall {
  display: flex;
  align-items: end;
}

.circle {
  height: 400px;
  width: 400px;
  border-radius: 50%;
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


.small-circle {
  height: 200px;
  width: 200px;
  border-radius: 50%;
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 20%;
}

.green {
  background-color: var(--green-light);
}

.blue {
  background-color: var(--blue-light);
}
.pad {
  margin: 5px;
}
</style>