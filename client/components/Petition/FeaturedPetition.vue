<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, onUpdated, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";
import FeedbackStateForm from "../Feedback State/FeedbackStateForm.vue";

// const props = defineProps(["petition"]);
const NUM_FEATURED = 5;
const petition: any = ref({});
const petitions: any = ref([]);
const randoms: Array<number> = [];
const petitionIndex = ref(0);
const emit = defineEmits(["editPetition", "refreshPetitions"]);
const { currentUsername, currentUserId } = storeToRefs(useUserStore());
const signed = ref(false);
const signers = ref(0);
const restaurantNameLoading = ref(true);
const restaurantName = ref("");
const response: any = ref({});
const madeFeedback: any = ref({});


const updateSigned = async () => {
  let newSigned: boolean;
  let newSigners: number;
  try {
    newSigned = currentUserId.value !== "" ? await fetchy(`/api/upvote/${petition.value._id}/${currentUserId.value}`, "GET") : false;
    newSigners = (await fetchy(`/api/upvote/${petition.value._id}`, "GET")).length;
  } catch {
    return;
  }
  signed.value = newSigned;
  signers.value = newSigners;
};

const trySign = async () => {
  try {
    await fetchy(`/api/upvote/${petition.value._id}/${currentUserId.value}`, "PUT");
  } catch {
    return;
  } finally {
    await updateSigned();
  }
};

const tryUnsign = async () => {
  try {
    await fetchy(`/api/upvote/${petition.value._id}/${currentUserId.value}`, "DELETE");
  } catch {
    return;
  } finally {
    await updateSigned();
  }
};

const convertIDtoNames = async () => {
  let restaurant;
  try {
    restaurant = await fetchy(`/api/business/id/${petition.value.target}`, "GET");
  } catch (e) {
    return;
  }
  //props.petition.target = restaurant.name;
  //props.petition.restaurant_name = restaurant.name;
  restaurantName.value = restaurant.name;
  restaurantNameLoading.value = false;
};

const getResponse = async () => {
  let tempResponse;
  try {
    tempResponse = await fetchy(`/api/response/concern/${petition.value._id}`, "GET");
  } catch (e) {
    return;
  }
  response.value = tempResponse;
};

const getPersonalFeedback = async () => {
  let tempFeedback;
  let query: Record<string, string> = response.value._id !== undefined ? { response: response.value._id } : {};
  try {
    tempFeedback = await fetchy(`/api/feedback/userFeedback/${response.value._id}`, "GET", query);
    if (tempFeedback) {
      madeFeedback.value = tempFeedback;
    } else {
      madeFeedback.value = {};
    }
  } catch (e) {
    return;
  }
};

const refreshPetitionList = () => {
  emit("refreshPetitions");
};

const goToResponseFeedbackView = async () => {
  await router.push({ path: `/feedback/${petition.value._id}` });
};

const getPetition = async () => {
  petitions.value = await fetchy("api/petitions/all", "GET");
  if (!petitions) {
    return;
  }
  for (let i = 0; i < NUM_FEATURED; i++) {
    let x = Math.floor(Math.random() * petitions.value.length);
    while (randoms.includes(x)) {
      x = Math.floor(Math.random() * petitions.value.length);
    }
    randoms.push(x);
  }
}

const setPetition = () => {
  petition.value = petitions.value[randoms[petitionIndex.value]]
}

const changeIndex = (incr: boolean) => {
  if (incr) {
    if (petitionIndex.value === NUM_FEATURED - 1) {
      petitionIndex.value = 0;
      setPetition();
      return;
    }
    petitionIndex.value += 1;
    setPetition();
    return;
  }
  if (petitionIndex.value === 0) {
      petitionIndex.value = NUM_FEATURED - 1;
      setPetition();
      return;
    }
    petitionIndex.value -= 1;
    setPetition();
    return;
}

onUpdated(async () => {
  await convertIDtoNames();
});

onBeforeMount(async () => {
  await getPetition();
  setPetition();
  await updateSigned();
  await convertIDtoNames();
  await getResponse();
  if (response.value._id) {
    await getPersonalFeedback();
  }
});

const linkRestaurantButtonToPage = () => {
  void router.push({ name: "Restaurant", params: { id: petition.value.target } });
};
</script>

<template>
  <h1 class="center">Featured Petitions</h1>
  <div class="row">
    <img src="../../assets/images/left-arrow.png" v-on:click="changeIndex(false)" class="arrow-button" />
    <div class="petition-container">
      <div class="top">
        <h1>{{ petition.title }}</h1>
      </div>
      <p v-if="restaurantNameLoading" class="center">Loading...</p>
      <p v-else  class="center">
        Restaurant: <button @click="linkRestaurantButtonToPage" class="pure-button pure-button-primary pad">{{ restaurantName }}</button>
      </p>
      <p class="center">Topic: {{ petition.topic }}</p>
      <div class="information">
        <p>Problem: {{ petition.problem }}</p>
        <p>Solution: {{ petition.solution }}</p>
      </div>
      <div class="line"></div>
      <div v-if="response._id">
        <div v-if="response.type.valueOf() === 1">
          <p class="statement">-- Petition Accepted on {{ formatDate(response.dateCreated) }} --</p>
          <p>Response: {{ response.response }}</p>
          <div v-if="madeFeedback._id" class="base">
            <button id="view-feedback-button" class="pure-button pure-button-primary" @click="goToResponseFeedbackView">View Feedback</button>
            <p>
              <b>{{ petition.creator }}</b>
            </p>
            <article class="timestamp">
              <p>Created on: {{ formatDate(petition.dateCreated) }}</p>
            </article>
          </div>
          <div v-else>
            <FeedbackStateForm :response="response" @refreshPetitions="refreshPetitionList" />
          </div>
        </div>
        <div v-else>
          <p class="statement">-- Petition Rejected on {{ formatDate(response.dateCreated) }} --</p>
          <p>Response: {{ response.response }}</p>
        </div>
      </div>
      <div class="base" v-else>
        <div class="progress">
          <div class="sign" v-if="currentUserId">
            <button class="pure-button pure-button-primary" v-if="!signed" @click="trySign">Sign</button>
            <button class="pure-button pure-button-primary" v-else @click="tryUnsign"><em>Signed!</em></button>
          </div>
          <p>Progress: {{ signers }}/{{ petition.upvoteThreshold }}</p>
        </div>
        <p>
          <b>{{ petition.creator }}</b>
        </p>
        <article class="timestamp">
          <p>Created on: {{ formatDate(petition.dateCreated) }}</p>
        </article>
      </div>
    </div>
    <img src="../../assets/images/right-arrow.png" v-on:click="changeIndex(true)" class="arrow-button" />
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}
.line {
  height: 1px;
  background: black;
  margin: 5px;
}

.statement {
  text-align: center;
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
  width: 80%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
}

.center {
  justify-content: center;
  font-size: larger;
  font-weight: bold;
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

.top h1 {
  margin: 5px;
}

.selectables {
  display: flex;
  justify-content: space-between;
}

.selectables p {
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

.information p {
  padding-top: 5px;
  padding-bottom: 5px;
}

#view-feedback-button {
  margin-top: 8px;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.center {
  text-align: center;
}

.arrow-button {
  height: 50px;
  width: 50px;
  padding: 5px;
}

.arrow-button:hover {
  height: 60px;
  width: 60px;
  cursor: pointer;
  padding: 0px;
}
</style>
