<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import PetitionFeedbackListComponent from "../components/Feedback State/PetitionFeedbackListComponent.vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["petitionid"]);
const averageEffectiveness = ref(0);
const response: any = ref({});
const petition:any = ref({});

const convertIDtoName = async () => {
    let restaurant;
    try {
        restaurant = await fetchy(`/api/business/id/${petition.value.target}`, "GET");
    } catch (e) {
        return;
    }
    petition.value.target = restaurant.name;
}

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

onBeforeMount(async () => {
    await getPetition();
    await convertIDtoName();
    await getResponse();
    await getEffectiveness();

});
</script>

<template>
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
        <div class="feedback">
        <h1>Effectiveness: {{ (averageEffectiveness >= 0)? averageEffectiveness.toFixed(1): "-" }}</h1>
        <PetitionFeedbackListComponent :response="response"/>
        </div>
    </div>
</template>

<style scoped>
.page {
    padding: 8px;
    display: grid;
    gap: 8px 8px;
    grid-template-columns: 30vw 65vw;
    grid-template-rows: 85vh ;
}

.response-info {
    grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
}

.feedback {
    grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
</style>