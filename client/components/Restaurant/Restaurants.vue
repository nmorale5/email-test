<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SearchRestaurantForm from "./SearchRestaurantForm.vue";
import SelectableRestaurant from "./SelectableRestaurant.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const loaded = ref(false);
const myRestaurants = ref([]);
const searchRestaurants = ref([]);

const getMyRestaurants = async() => {
  try {
    const user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
    myRestaurants.value = await fetchy(`/api/business/user/${user._id}`, "GET");
    return;
  } catch {
    return;
  }
}

const getRestaurants = async(filter?: string) => {
  try {
    if (filter){
      searchRestaurants.value = await fetchy(`/api/business/${filter}`, "GET");
    } else {
      searchRestaurants.value = await fetchy(`/api/business`, "GET");
    }
    return;
  } catch {
    return;
  }
}

onBeforeMount(async () => {
  if (isLoggedIn.value) {
    await getMyRestaurants();
  }
  loaded.value = true;
});
</script>
<template>
  <h1 v-if="!loaded">Loading...</h1>
  <SearchRestaurantForm @getRestaurantsByName="getRestaurants" />
  <p>Number of restaurants found: {{ searchRestaurants.length }}</p>
  <article v-for="restaurant in searchRestaurants">
    <SelectableRestaurant :restaurant="restaurant"/>
  </article>
  <div v-if="isLoggedIn">
    <h2>My Restaurants: </h2>
    <article v-for="restaurant in myRestaurants">
      <SelectableRestaurant :restaurant="restaurant"/>
    </article>
    <p v-if="myRestaurants.size === 0">You manage no restaurants.</p>
    <p v-else>Number of restaurants you own: {{ myRestaurants.length }}</p>
    <h2>Add Yourself To Restaurant</h2>
    <p>Make submission form for token to business using route</p>
  </div>
  <div v-else>
    <p>Log in if you wish to view your restaurants or be added as an owner of a restaurant.</p>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
