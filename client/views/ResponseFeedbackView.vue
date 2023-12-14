<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import FeedbackStateForm from "../components/Feedback State/FeedbackStateForm.vue";
import PetitionFeedbackListComponent from "../components/Feedback State/PetitionFeedbackListComponent.vue";
import Tooltip from "../components/Setting/Tooltip.vue";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["petitionid"]);
const { isLoggedIn } = storeToRefs(useUserStore());
const averageEffectiveness = ref(0);
const response: any = ref({});
const petition:any = ref({});
const madeFeedback: any = ref(false);

const convertIDtoName = async () => {
    let restaurant;
    try {
        restaurant = await fetchy(`/api/business/id/${petition.value.target}`, "GET");
    } catch (e) {
        return;
    }
    petition.value.target = restaurant.name;
}

const getPersonalFeedback = async () => {
  if (!isLoggedIn.value) {
    return;
  }

  let tempFeedback;
  try {
    tempFeedback = await fetchy(`/api/feedback/userFeedback/${response.value._id}`, "GET");
  } catch (e) {
    return;
  }

  if (tempFeedback !== null) {
      madeFeedback.value = true;
    } else {
      madeFeedback.value = false;
    }
    console.log(tempFeedback)
};

const getEffectiveness =async () => {
    let feedbackList;
    try {
        feedbackList = await fetchy(`/api/feedback/all/userFeedback/${response.value._id}`, "GET")
        
    } catch (_) {
        console.log
        return;
    }
    averageEffectiveness.value = (feedbackList.length > 0)? feedbackList.map((feedback: any) => feedback.rating).reduce((prevRating: any, currRating: any)=> prevRating+currRating, 0)/feedbackList.length : -1;
}

const getResponse = async () => {
    let userResponse;
    try {
        userResponse = await fetchy(`/api/response/concern/${props.petitionid}`, "GET")
    } catch (_) {
        return;
    }
    response.value = userResponse;
}

const getPetition =async () => {
    let currPetition;
    try {
        currPetition = await fetchy(`/api/petition/${props.petitionid}`, "GET")
    } catch (_) {
        return;
    }
    petition.value = currPetition;
}

const updateFeedback = async () => {
    madeFeedback.value = true;
    await getEffectiveness();
}

onBeforeMount(async () => {
    await getPetition();
    await convertIDtoName();
    await getResponse();
    await getEffectiveness();
    await getPersonalFeedback();

});
</script>

<template>
    <div class="row">
        <div class="page">
            <div class="response-info">
                <div class="selectables">
                    <p><b>Restaurant:</b> <div>{{ petition.target }}</div></p>
                    <p><b>Topic:</b> <div>{{ petition.topic }}</div></p>
                </div>
                <div class="information">
                    <p><b>Problem:</b> <div>{{ petition.problem }}</div></p>
                    <p><b>Proposed Solution:</b> <div>{{ petition.solution }}</div></p>
                    <p><b>Restaurant Response:</b> <div>{{ response.response }}</div></p>
                </div>
            </div>
        </div>
        <div class="page">
            <div v-if="isLoggedIn && !madeFeedback">
                <h2>Add your own feedback here!</h2>
                <FeedbackStateForm @refresh-feedback="updateFeedback" :response="response"/>
                <Tooltip
                    displaytext="How ratings work"
                    hovertext="Restaurants need a minimum number of 4-5 star ratings over the feedback period in order to receive a badge. All ratings are averaged to compute the overall Effectiveness"
                />
            </div>
            <div v-else-if="isLoggedIn">
                <h2>Thank you for submitting feedback!</h2>
            </div>
            <div v-else>
                <h2>Log in to submit your own feedback</h2>
            </div>
        </div>
    </div>
    <div class="feedback">
        <h2>Effectiveness: {{ (averageEffectiveness >= 0)? averageEffectiveness.toFixed(1): "0" }}</h2>
        <PetitionFeedbackListComponent :response="response"/>
    </div>
</template>

<style scoped>
.page {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
    width: 40%;
}

.response-info {
    grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
}

.feedback {
    margin-left: 5%;
    margin-bottom: 100px;
    width: 100%;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
</style>