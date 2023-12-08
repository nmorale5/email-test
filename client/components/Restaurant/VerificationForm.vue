<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineEmits, ref } from "vue";
import router from "../../router";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const emit = defineEmits(["verified"]);
const token = ref("");
const { currentUserId , isLoggedIn } = storeToRefs(useUserStore());

const addUserToRestaurant = async () => {
  try {
    const businessId = await fetchy("/api/business/users", "PUT", { body: { userId: currentUserId.value, token: token.value } });
    emit("verified");
    await router.push({ name: "Restaurant", params: { id: businessId } });
  } catch {
    return;
  }
};
</script>

<template>
  <div v-if="isLoggedIn">
    <form class="pure-form">
      <fieldset>
        <h2>Add Yourself To Restaurant</h2>
        <input id="token" v-model="token" placeholder="Token from inbox" required />
        <button type="submit" class="pure-button-primary pure-button" v-on:click="addUserToRestaurant">Join Restaurant</button>
      </fieldset>
    </form>
  </div>
</template>


<style scoped>
h2 {
  text-align: center;
  font-size: xx-large;
}
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
  border-radius: 10px;
}
</style>