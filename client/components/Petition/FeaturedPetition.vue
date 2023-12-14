<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, onUpdated, ref, watch } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

// const props = defineProps(["petition"]);
const NUM_FEATURED = 5;
const petition: any = ref({});
const petitions: any = ref([]);
const randoms: Array<number> = [];
const petitionIndex = ref(0);
const emit = defineEmits(["editPetition", "refreshPetitions"]);
const { currentUsername, currentUserId, isLoggedIn } = storeToRefs(useUserStore());
const signed = ref(false);
const signers = ref(0);
const restaurantNameLoading = ref(true);
const restaurantName = ref("");
const response: any = ref({});

watch(petitionIndex, () => setPetition());

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
    response.value = {};
    return;
  }
  response.value = tempResponse;
};

const refreshPetitionList = () => {
  emit("refreshPetitions");
};

const goToResponseFeedbackView = async () => {
  await router.push({ path: `/feedback/${petition.value._id}` });
};

const getPetition = async () => {
  petitions.value = await fetchy("api/petitions/all", "GET");
  if (!petitions.value) {
    return;
  }
  for (let i = 0; i < NUM_FEATURED; i++) {
    let x = Math.floor(Math.random() * petitions.value.length);
    while (randoms.includes(x)) {
      x = Math.floor(Math.random() * petitions.value.length);
    }
    randoms.push(x);
  }
};

const setPetition = async () => {
  petition.value = petitions.value[randoms[petitionIndex.value]];
  await updateSigned();
  await convertIDtoNames();
  await getResponse();
};

onUpdated(async () => {
  await convertIDtoNames();
});

onBeforeMount(async () => {
  await getPetition();
  setPetition();
});

const linkRestaurantButtonToPage = () => {
  void router.push({ name: "Restaurant", params: { id: petition.value.target } });
};
</script>

<template>
  <h1 class="center">Featured Petitions</h1>
  <div class="row">
    <img src="../../assets/images/left-arrow.png" v-on:click="petitionIndex = (petitionIndex - 1 + NUM_FEATURED) % NUM_FEATURED" class="arrow-button" />
    <div class="pagination">
      <span v-for="(_, index) in NUM_FEATURED" :key="index" :class="{ current: index === petitionIndex }" @click="petitionIndex = index"></span>
    </div>
    <img src="../../assets/images/right-arrow.png" v-on:click="petitionIndex = (petitionIndex + 1) % NUM_FEATURED" class="arrow-button" />
  </div>
  <div class="row">
    <div class="petition-container">
      <div class="top pad-text">
        <h1>{{ petition.title }}</h1>
      </div>
      <p v-if="restaurantNameLoading" class="center pad-text">Loading...</p>
      <p v-else class="center pad-text">
        Restaurant: <button @click="linkRestaurantButtonToPage" class="pure-button pure-button-primary pad">{{ restaurantName }}</button>
      </p>
      <p class="center pad-text">Topic: {{ petition.topic }}</p>
      <div class="information">
        <p class="pad-text">Problem: {{ petition.problem }}</p>
        <p class="pad-text">Solution: {{ petition.solution }}</p>
      </div>
      <div class="line"></div>
      <div v-if="response._id">
        <div v-if="response.type.valueOf() === 1">
          <p class="statement pad-text">-- Petition Accepted on {{ formatDate(response.dateCreated) }} --</p>
          <p class="pad-text">Response: {{ response.response }}</p>
          <div class="base">
            <button id="view-feedback-button" class="pure-button pure-button-primary" @click="goToResponseFeedbackView">View Feedback</button>
            <p>
              <b class="pad-text">{{ petition.creator }}</b>
            </p>
            <article class="timestamp pad-text">
              <p>Created on: {{ formatDate(petition.dateCreated) }}</p>
            </article>
          </div>
        </div>
        <div v-else>
          <p class="statement pad-text">-- Petition Rejected on {{ formatDate(response.dateCreated) }} --</p>
          <p class="pad-text">Response: {{ response.response }}</p>
        </div>
      </div>
      <div class="base" v-else>
        <div class="progress">
          <div class="sign" v-if="currentUserId">
            <button class="pure-button pure-button-primary" v-if="!signed" @click="trySign">Sign</button>
            <button class="pure-button pure-button-primary" v-else @click="tryUnsign"><em>Signed!</em></button>
          </div>
          <p class="pad-text">Progress: {{ signers }}/{{ petition.upvoteThreshold }}</p>
        </div>
        <p>
          <b class="pad-text">{{ petition.creator }}</b>
        </p>
        <article class="timestamp">
          <p class="pad-text">Created on: {{ formatDate(petition.dateCreated) }}</p>
        </article>
      </div>
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

.pad-text {
  padding: 10px;
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
  height: 32px;
  width: 32px;
  padding: 0px;
  margin: 0px;
}

.arrow-button:hover {
  /* width: 48px;
  height: 48px; */
  cursor: pointer;
  padding: 0px;
}

.pagination {
  display: flex;
  justify-content: center; /* Horizontally centers the div */
  align-items: center; /* Vertically centers the div */
  /* padding-bottom: 1em; */
}

span {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 0 5px;
  background-color: #ccc; /* Default dot color */
  cursor: pointer;
}

span.current {
  background-color: var(--green); /* Current dot color */
}
</style>
