<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, onUpdated, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["petition"]);
const emit = defineEmits(["editPetition", "refreshPetitions"]);
const { currentUsername, currentUserId } = storeToRefs(useUserStore());
const signed = ref(false);
const signers = ref(0);
const restaurantNameLoading = ref(true);

const deletePetition = async () => {
  try {
    await fetchy(`/api/petition/${props.petition._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPetitions");
};

const updateSigned = async () => {
  let newSigned: boolean;
  let newSigners: number;
  try {
    newSigned = currentUserId.value !== "" ? await fetchy(`/api/upvote/${props.petition._id}/${currentUserId.value}`, "GET") : false;
    newSigners = (await fetchy(`/api/upvote/${props.petition._id}`, "GET")).length;
  } catch {
    return;
  }
  signed.value = newSigned;
  signers.value = newSigners;
};

const trySign = async () => {
  try {
    await fetchy(`/api/upvote/${props.petition._id}/${currentUserId.value}`, "PUT");
  } catch {
    return;
  } finally {
    await updateSigned();
  }
};

const tryUnsign = async () => {
  try {
    await fetchy(`/api/upvote/${props.petition._id}/${currentUserId.value}`, "DELETE");
  } catch {
    return;
  } finally {
    await updateSigned();
  }
};

const convertIDtoNames = async () => {
    let restaurant;
    try {
        restaurant = await fetchy(`/api/business/id/${props.petition.target}`, "GET");
    } catch (e) {
        return;
    }
    //props.petition.target = restaurant.name;
    props.petition.restaurant_name = restaurant.name
    restaurantNameLoading.value = false;
}

onUpdated(async () => {
  await convertIDtoNames();
})

onBeforeMount(async ()=> {
    updateSigned();
    convertIDtoNames();
});
</script>

<template>
    <div class="top">
        <h1>{{ props.petition.title }}</h1>
        <p>{{ props.petition.creator }}</p>
    </div>
    <div class="selectables">
        <p v-if="restaurantNameLoading">Loading...</p>
        <p v-else="restaurantNameLoading">Restaurant: <div class="tag">{{ props.petition.restaurant_name }}</div></p>
        <p>Topic: <div class="tag">{{ props.petition.topic }}</div></p>
    </div>
    <div class="information">
        <p>Problem: {{ props.petition.problem }}</p>
        <p>Solution: {{ props.petition.solution }}</p>
        <p>Progress: {{ signers }}/{{ props.petition.upvoteThreshold }}</p>
    </div>
  <div class="base">
    <div v-if="currentUserId">
        <button v-if="!signed" @click="trySign">Sign</button>
        <button v-else @click="tryUnsign"><em>Signed!</em></button>
    </div>
    <article class="timestamp">
      <p>Created on: {{ formatDate(props.petition.dateCreated) }}</p>
    </article>
    <menu v-if="props.petition.creator == currentUsername">
      <li><button class="button-error btn-small pure-button" @click="deletePetition">Delete</button></li>
    </menu>
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

.top {
    text-align: center;
}

.top h1{
    margin: 5px;
}

.selectables {
    display: flex;
    justify-content: space-between;
}

.selectables p{
    display: flex;
    align-items: center;
}

.tag {
  background-color: white;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 45px;
  padding: 4px;
  border: 1px black solid;
}

.information p{
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>
