<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, onUpdated, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";
import FeedbackStateForm from "../Feedback State/FeedbackStateForm.vue";


const props = defineProps(["petition"]);
const emit = defineEmits(["editPetition", "refreshPetitions"]);
const { currentUsername, currentUserId } = storeToRefs(useUserStore());
const signed = ref(false);
const signers = ref(0);
const restaurantNameLoading = ref(true);
const restaurantName = ref("");
const response:any = ref({});
const madeFeedback: any = ref({});

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
    //props.petition.restaurant_name = restaurant.name;
    restaurantName.value = restaurant.name;
    restaurantNameLoading.value = false;
}

const getResponse =async () => {
  let tempResponse;
  try {
    tempResponse = await fetchy(`/api/response/concern/${props.petition._id}`, "GET");
  } catch (e) {
    return;
  }
  response.value = tempResponse;
}

const getPersonalFeedback =async () => {
  let tempFeedback;
  let query: Record<string, string> = response.value._id !== undefined ? {response: response.value._id} : {};
  try {
    tempFeedback = await fetchy(`/api/feedback/userFeedback/${response.value._id}`, "GET", query)
  } catch (e) {
    return;
  }
  madeFeedback.value = tempFeedback;
}

const refreshPetitionList =async () => {
  emit("refreshPetitions"); 
}

const goToResponseFeedbackView = async () => {
  await router.push({path: `/feedback/${props.petition._id}`})
}

onUpdated(async () => {
  await convertIDtoNames();
})

onBeforeMount(async ()=> {
    await updateSigned();
    await convertIDtoNames();
    await getResponse();
    if(response.value._id) await getPersonalFeedback();
});
</script>

<template>
  <div class="petition-container">
    <div class="top">
        <h1>{{ props.petition.title }}</h1>
    </div>
    <div class="selectables">
        <p v-if="restaurantNameLoading">Loading...</p>
        <p v-else>Restaurant: <button type="submit" class="pure-button pure-button-primary pad">{{ restaurantName }}</button></p>
        <p>Topic: {{ props.petition.topic }}</p>
    </div>
    <div class="information">
        <p>Problem: {{ props.petition.problem }}</p>
        <p>Solution: {{ props.petition.solution }}</p>
    </div>
    <div v-if="response._id">
      <div v-if="response.type.valueOf() === 1">
        <p>-- Petition Accepted on {{ formatDate(response.dateCreated) }} --</p>
        <p>Response: {{ response.response }}</p>
        <div v-if="madeFeedback._id">
          <article class="timestamp">
            <p>Created on: {{ formatDate(props.petition.dateCreated) }}</p>
          </article>
          <menu v-if="props.petition.creator == currentUsername">
            <li><button class="button-error btn-small pure-button" @click="deletePetition">Delete</button></li>
          </menu>
          <button @click="goToResponseFeedbackView">View Feedback</button>
        </div>
        <div v-else>
          <FeedbackStateForm :response="response" @refreshPetitions="refreshPetitionList"/>
        </div>
      </div>
      <div v-else>
        <p>-- Petition Rejected on {{ formatDate(response.dateCreated) }} --</p>
        <p>Response: {{ response.response }}</p>
      </div>
    </div>
    <div class="line"></div>
    <div class="base" v-else>
      <div class="progress">
        <div class="sign" v-if="currentUserId">
          <button class="pure-button pure-button-primary" v-if="!signed" @click="trySign">Sign</button>
          <button class="pure-button pure-button-primary" v-else @click="tryUnsign"><em>Signed!</em></button>
        </div>
        <p>Progress: {{ signers }}/{{ props.petition.upvoteThreshold }}</p>
      </div>
      <p><b>{{ props.petition.creator }}</b></p>
      <article class="timestamp">
        <p>Created on: {{ formatDate(props.petition.dateCreated) }}</p>
      </article>
      <menu v-if="props.petition.creator == currentUsername">
        <li><button class="button-error btn-small pure-button" @click="deletePetition">Delete</button></li>
      </menu>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}
.line {
height: 1px;
background: black;
margin-top: 5px;
}

.progress {
  display: flex;
  align-items: center;
}

.sign {
  margin-left: 5px;
}

.pure-button-primary {
  margin: 2px;
}

.pad {
  padding-top: 1px;
  padding-right: 4px;
  padding-bottom: 1px;
  padding-left: 4px;
  font-weight: lighter;
}

.petition-container {
  background-color: var(--base-bg);
  border-radius: 10px;
  padding: 10px 10px 0px 10px;
  border-style: solid;
  border-width: 2px;
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
  background-color: var(--blue);
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 5px;
  padding: 4px;
  color: white;
}

.information p{
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>
