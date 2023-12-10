<script setup lang="ts">
import BadgeList from "@/components/Badges/BadgeList.vue";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import PetitionComponent from "../Petition/PetitionComponent.vue";
import ResponseFormComponent from "../Response/ResponseFormComponent.vue";
import { RestaurantData } from "./Restaurants.vue";

enum RESPONSE_TYPE {
  REJECTED,
  ACCEPTED,
}

export interface ResponseData {
  concern: ObjectId;
  response: string;
  date: number;
  type: RESPONSE_TYPE;
}

export interface PetitionData {
  _id: ObjectId;
  title: string;
  problem: string;
  solution: string;
  topic: string;
  target: ObjectId;
  creator: string;
  upvoteThreshold: number;
}
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const { restaurant, petitions, badges } = defineProps(["restaurant", "petitions", "badges"]);
const emit = defineEmits(["refreshResponse"])

const myRestaurants = ref(new Array<RestaurantData>());
const isOwner = ref(false);
const reputation = ref(0);
const responsePetitions = ref(new Array<string>());

const getMyRestaurants = async () => {
  try {
    const user = await fetchy(`/api/users/${currentUsername.value}`, "GET");
    const restaurants = await fetchy(`/api/business/user/${user._id}`, "GET");
    if (!restaurants) return;
    const restaurantIds = restaurants.map((restaurant: { _id: { toString: () => any } }) => {
      return restaurant._id.toString();
    });
    isOwner.value = restaurantIds.includes(restaurant._id.toString());
    const responses = await fetchy(`/api/response/business/${restaurant._id}`, "GET");
    responsePetitions.value = responses.map((response: ResponseData) => {
      return response.concern.toString();
    });
    return;
  } catch {
    return;
  }
};

const displayResponseForm = (petition: PetitionData) => {
  const id = petition._id.toString();
  return isOwner && !responsePetitions.value.includes(id);
}

const handleResponseEvent = async () => {
  await getMyRestaurants()
  emit("refreshResponse")
}


const getReputation =async () => {
  let restaurantReputation;
  try {
    restaurantReputation = await fetchy(`/api/reputation/${restaurant._id}`, "GET")
  } catch (e) {
    return;
  }
  reputation.value = restaurantReputation;
}

onBeforeMount(async () => {
  if (isLoggedIn.value) {
    await getMyRestaurants();
    await getReputation();
  }
});
</script>
<template>
  <div class="page">
    <header>
      <h1 class="name">{{ restaurant.name }}</h1>
      <div class="restaurant-info">
        <BadgeList :badges="badges" />
        <h2>Reputation: {{ reputation }}</h2>
      </div>
    </header>
    <div class="line"></div>
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
      @refreshResponse="handleResponseEvent"
      v-if="displayResponseForm(petition)"
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
  </div>
</template>
<style scoped>
.name {
  text-align: center;
}

header {
  display: flex;
  flex-direction: column;
}

.restaurant-info {
  display: flex;
  justify-content: space-between;
}

.page {
  padding: 8px;
}

.line {
  height: 1px;
  background: black;
}

h1 {
  margin-bottom: 4px;
}
</style>
