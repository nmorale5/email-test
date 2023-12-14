<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form" @submit.prevent="login">
    <h3>Login</h3>
    <fieldset>
      <div class="pure-control-group pad center">
        <label for="aligned-name" class="pad">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group pad center">
        <label for="aligned-password" class="pad-more">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-controls pad-max center">
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.pad {
  padding: 5px;
}

.pad-more {
  padding: 5px;
  padding-right: 9px;
}

.pad-max {
  padding: 20px;
}

.center {
  display: flex;
  justify-content: center;
}
</style>
