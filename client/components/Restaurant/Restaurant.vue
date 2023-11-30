<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SearchRestaurantForm from "./SearchRestaurantForm.vue";
import SelectableRestaurant from "./SelectableRestaurant.vue";
import SingleRestaurant from "./SingleRestaurant.vue";



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
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const loaded = ref(false);
const currentRestaurant = ref({});
const searchRestaurants = ref(new Array<RestaurantData>());

const getRestaurants = async (filter?: string) => {
  try {
    searchRestaurants.value = await fetchy(`/api/business/${filter}`, "GET");
    return;
  } catch {
    return;
  }
};

const updateCurrent = async () => {
  // const restaurantId = $route.params.param;
  // currentRestaurant.value = restaurant;
};

onBeforeMount(async () => {
  await getRestaurants("");
  loaded.value = true;
});
</script>
<template>
  <h1 v-if="!loaded">Loading...</h1>
  <SearchRestaurantForm @getRestaurantsByName="getRestaurants" />
  <p>Number of restaurants found: {{ searchRestaurants.length }}</p>
  <article v-for="restaurant in searchRestaurants" :key="restaurant._id.toString()">
    <SelectableRestaurant :restaurant="restaurant" v-on:click="updateCurrent"/>
  </article>
  <article v-if="!currentRestaurant">
    <p>Select a restaurant</p>
  </article>
  <article v-else>
    <SingleRestaurant :restaurant="currentRestaurant" />
  </article>
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
