<script setup lang="ts">
import BadgeList from "@/components/Badges/BadgeList.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import PetitionComponent from "../Petition/PetitionComponent.vue";
import ResponseFormComponent from "../Response/ResponseFormComponent.vue";
import { RestaurantData } from "./Restaurants.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const myRestaurants = ref(new Array<RestaurantData>());
const isOwner = ref(false);

const getMyRestaurants = async () => {
  try {
    const user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
    const restaurants = await fetchy(`/api/business/user/${user._id}`, "GET");
    if (!restaurants) return;
    const restaurantIds = restaurants.map((restaurant: { _id: { toString: () => any } }) => {
      return restaurant._id.toString();
    });
    isOwner.value = restaurantIds.includes(restaurant._id.toString());
    return;
  } catch {
    return;
  }
};

const { restaurant, petitions, badges } = defineProps(["restaurant", "petitions", "badges"]);

onBeforeMount(async () => {
  if (isLoggedIn.value) {
    await getMyRestaurants();
  }
});
</script>
<template>
  <header>
    <h2>{{ restaurant.name }}</h2>
    <BadgeList :badges="badges" />
  </header>
  <h3>Petitions:</h3>
  <p v-if="petitions.length === 0"><em>None</em></p>
  <div v-else v-for="petition in petitions" :key="petition._id">
    <PetitionComponent
      :petition="{
        _id: petition._id,
        creator: petition.creator,
        title: petition.title,
        problem: petition.problem,
        solution: petition.solution,
        upvoteThreshold: petition.upvoteThreshold,
        topic: petition.topic,
        target: petition.target,
        dateUpdated: petition.dateUpdated,
        dateCreated: petition.dateCreated,
      }"
    />
    <ResponseFormComponent
      v-if="isOwner"
      :petition="{
        _id: petition._id,
        creator: petition.creator,
        title: petition.title,
        problem: petition.problem,
        solution: petition.solution,
        upvoteThreshold: petition.upvoteThreshold,
        topic: petition.topic,
        target: restaurant._id,
        dateUpdated: petition.dateUpdated,
        dateCreated: petition.dateCreated,
      }"
    />
  </div>
</template>
