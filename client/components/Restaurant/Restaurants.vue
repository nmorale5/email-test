<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SearchRestaurantForm from "./SearchRestaurantForm.vue";
import SelectableRestaurant from "./SelectableRestaurant.vue";
import VerificationForm from "./VerificationForm.vue";

const restaurantSearch = ref("");
const allRestaurants: any = ref([]);
const allRestaurantsSorted = computed(() => allRestaurants.value.slice().sort((a: any, b: any) => a.name.localeCompare(b.name, "en", { numeric: true })));
const filteredRestaurants = computed(() => allRestaurantsSorted.value.filter((restaurant: any) => restaurant.name.toLowerCase().includes(restaurantSearch.value.toLowerCase())));
const isNewRestaurant = computed(() => filteredRestaurants.value.length === 0);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const loaded = ref(false);

// make sure this always matches backend BusinessDoc
export interface RestaurantData {
  _id: ObjectId;
  dateCreated: Date;
  dateUpdated: Date;
  name: string;
  email: string;
  token: string;
  users: Array<ObjectId>;
}
const myRestaurants = ref(new Array<RestaurantData>());
const token = ref("");

const getMyRestaurants = async () => {
  try {
    const user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
    myRestaurants.value = await fetchy(`/api/business/user/${user._id}`, "GET");
    return;
  } catch {
    return;
  }
};

const getRestaurants = async (filter?: string) => {
  try {
    restaurantSearch.value = filter??"";
    allRestaurants.value = await fetchy(`/api/business/`, "GET");
    return;
  } catch {
    return;
  }
};

const deleteRestaurant = async () => {
  try {
    await fetchy("/api/business", "DELETE");
    return;
  } catch {
    return;
  }
};

const addRandomBadge = async () => {
  try {
    await fetchy(`/api/badges/test/addRandomBadge`, "GET");
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await getRestaurants();
  if (isLoggedIn.value) {
    await getMyRestaurants();
  }
  loaded.value = true;
});
</script>
<template>
  <VerificationForm @verified="getMyRestaurants" />
  <h1 v-if="!loaded">Loading...</h1>
  <SearchRestaurantForm @getRestaurantsByName="getRestaurants" />
  <p>Number of restaurants found: {{ filteredRestaurants.length }}</p>
  <div class="button-list">
    <div v-for="restaurant in filteredRestaurants" :key="restaurant._id.toString()">
      <SelectableRestaurant :restaurant="restaurant" />
    </div>
  </div>
  <div v-if="isLoggedIn">
    <h2>My Restaurants:</h2>
    <div v-for="restaurant in myRestaurants" :key="restaurant._id.toString()">
      <SelectableRestaurant :restaurant="restaurant"/>
    </div>
    <p v-if="myRestaurants.length === 0">You manage no restaurants.</p>
    <p v-else>Number of restaurants you own: {{ myRestaurants.length }}</p>
    <!-- <article>
      <button v-on:click="deleteRestaurant">Delete Business (for debugging/testing)</button>
      <button @click="addRandomBadge">Add Random Badge (debug) (refresh page after)</button>
    </article> -->
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
