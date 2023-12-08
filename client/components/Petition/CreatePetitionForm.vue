<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import router from "../../router";
import { useRestrictionStore } from "../../stores/restrictions";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const problem = ref("");
const solution = ref("");
const topic = ref("");
const restaurantSearch = ref("");
const selectedRestaurant: any = ref({})
const email = ref("");
const displaySearch = ref(false);
const allRestaurants: any = ref([]);
const allRestaurantsSorted = computed(() => allRestaurants.value.slice().sort((a: any, b: any) => a.name.localeCompare(b.name, "en", { numeric: true })));
const filteredRestaurants = computed(() => allRestaurantsSorted.value.filter((restaurant: any) => restaurant.name.toLowerCase().includes(restaurantSearch.value.toLowerCase())));
const isNewRestaurant = computed(() => filteredRestaurants.value.length === 0);
const { restrictions } = storeToRefs(useRestrictionStore());

const createPetition = async () => {
  if (isNewRestaurant.value) {
    // todo: make sure email is plausible (i.e., has @ and .)
    const businessID = await createRestaurant(restaurantSearch.value, email.value);
    selectedRestaurant.value = await fetchy(`/api/business/id/${businessID}`, "GET");
  }
  if(selectedRestaurant.value.name !== restaurantSearch.value) throw new Error("A restaurant has not been selected")
  try {
    await fetchy("/api/petition", "POST", {
      body: { title: title.value, problem: problem.value, solution: solution.value, topic: topic.value, restaurant: selectedRestaurant.value._id },
    });
  } catch (_) {
    return;
  }
  // todo: navigate to users own profile page so they can see published petition
  await router.push({ name: "Home" });
};

const createRestaurant = async (name: string, email: string) => {
  try {
    return await fetchy("/api/business", "POST", {
      body: { name, email },
    });
  } catch (_) {
    return;
  }
};

const selectRestaurant = (selection: any) => {
  displaySearch.value = false;
  selectedRestaurant.value = selection;
  restaurantSearch.value = selection.name;
};

const hideSearch = () => {
  setTimeout(() => (displaySearch.value = false), 500);
};

const getRestaurants = async () => {
  let restaurants;
  try {
    restaurants = await fetchy("/api/business", "GET");
  } catch (_) {
    return;
  }
  allRestaurants.value = restaurants;
};

onBeforeMount(async () => {
  await getRestaurants();
});
</script>

<template>
  <form @submit.prevent="createPetition">
    <label for="name">Title:</label>
    <input id="name" v-model="title" placeholder="Enter a title" autocomplete="off" required />
    <label for="problem">Problem:</label>
    <input id="problem" v-model="problem" placeholder="List the current problem" autocomplete="off" required />
    <label for="solution">Proposed Solution:</label>
    <input id="solution" v-model="solution" placeholder="Propose a solution to the problem" autocomplete="off" required />
    <label for="topic">Topic:</label>
    <select v-model="topic" id="topic">
      <option v-for="restriction of restrictions" :value="restriction" :key="restriction">{{ restriction }}</option>
    </select>
    <label for="restaurant">Restaurant:</label>
    <input v-model="restaurantSearch" type="text" id="restaurant" @focus="displaySearch = true" @blur="hideSearch" placeholder="Search..." autocomplete="off" />
    <ul id="autocomplete-list" v-if="!isNewRestaurant && displaySearch">
      <li v-for="restaurant in filteredRestaurants.slice(0, 10)" @click="selectRestaurant(restaurant)" :key="restaurant" class="selection">
        {{ restaurant.name }}
      </li>
    </ul>
    <div v-if="isNewRestaurant">
      <p><em>Restaurant not found. You can add it to our list by additionally providing a company email.</em></p>
      <label for="email">Email:</label><br />
      <input id="email" v-model="email" placeholder="Owner Email" autocomplete="off" required />
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

.selection:hover {
  background-color: darkgray;
}
</style>
