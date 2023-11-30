<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRestrictionStore } from "../../stores/restrictions";
import { fetchy } from "../../utils/fetchy";
import CreateRestaurant from "./CreateRestaurant.vue";

const title = ref("");
const problem = ref("");
const solution = ref("");
const topic = ref("");
const restaurant:any = ref({});
const listOfRestaurants: any = ref([])
const restaurantSearch = ref("")
const { restrictions } = storeToRefs(useRestrictionStore());

const createPetition = async () => {
  try {
    await fetchy("/api/petition", "POST", {
      body: {title: title.value, problem: problem.value, solution: solution.value, topic: topic.value, restaurant: restaurant.value._id},
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  problem.value = "";
  solution.value = "";
  topic.value = "";
  restaurant.value = "";
};

const selectRestaurant = (selection: any) => {
  restaurant.value = selection
  restaurantSearch.value = selection.name;
}

const getRestaurants = async () => {
  let restaurants;
  try {
    restaurants = await fetchy("/api/business", "GET");
  } catch (_) {
    console.log(_)
    return;
  }
  listOfRestaurants.value = restaurants;
}

onBeforeMount(async () => {
  await getRestaurants();
});
</script>

<template>
  <form @submit.prevent="createPetition()">
    <label for="name">Title:</label>
    <input id="name" v-model="title" placeholder="Enter a title" required/>
    <label for="problem">Problem:</label>
    <input id="problem" v-model="problem" placeholder="List the current problem" required/>
    <label for="solution">Proposed Solution:</label>
    <input id="solution" v-model="solution" placeholder="Propose a solution to the problem" required/>
    <label for="topic">Topic:</label>
    <select v-model="topic" id="topic">
      <option v-for="restriction of restrictions" value="restriction">{{ restriction }}</option>
    </select>
    <label for="restaurant">Restaurant:</label>
    <input v-model="restaurantSearch" type="text" id="restaurant" placeholder="Search...">
    <ul id="autocomplete-list">
      <li v-for="restaurant in listOfRestaurants.filter((restaurant: any) => restaurant.name.toLowerCase().includes(restaurantSearch.toLocaleLowerCase())).slice(0, 5)" @click="selectRestaurant(restaurant)">{{ restaurant.name }}</li>
    </ul>
    <div v-if="listOfRestaurants.filter((restaurant: any) => restaurant.name.toLowerCase().includes(restaurantSearch.toLowerCase())).length === 0">
      <i>Restaurant not found. You can add it to our list by additionally providing a company email.</i>
      <CreateRestaurant />
    </div>
    <button type="submit" class="pure-button-primary pure-button">Create Petition</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>