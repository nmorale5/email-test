<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const username = ref("");
const password = ref("");
const token = ref("");
const { createUser, loginUser, updateSession } = useUserStore();
const { currentUserId } = storeToRefs(useUserStore())

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  await updateSession();

  if (token.value !== "") {
    try {
      const businessId = await fetchy("/api/business/users", "PUT", { body: { userId: currentUserId.value, token: token.value } });
      void router.push({ name: "Restaurant", params: { id: businessId } });
      return
    } catch (e) {

    }
  }
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="pure-control-group pad center">
        <label for="aligned-name" class="pad">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group pad center">
        <label for="aligned-password" class="pad-more">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-control-group pad center">
        <label for="aligned-token" class="pad-more">Token (optional)</label>
        <input type="password" v-model.trim="token" id="aligned-token" placeholder="Restaurant email token"/>
      </div>
      <div class="pure-controls pad-max center">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
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
