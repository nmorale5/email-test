<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import PetitionFeedbackListComponent from "../components/Feedback State/PetitionFeedbackListComponent.vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["petitionid"]);
const averageEffectiveness = ref(0)
const response: any = ref({})
const petition:any = ref({})

const convertIDtoName = async () => {
    let restaurant;
    try {
        restaurant = await fetchy(`/api/business/id/${petition.target}`, "GET");
    } catch (e) {
        return;
    }
    petition.value.target = restaurant.name;
}

const getEffectiveness =async () => {
    let feedbackList;
    let query: Record<string, string> = response !== undefined ? {response: response._id} : {};
    try {
        feedbackList = await fetchy(`/api/feedback/all/userFeedback/`, "GET", query)
    } catch (_) {
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
    <div class="response-info">
        <div class="selectables">
            <p>Restaurant: <div class="tag">{{ petition.target }}</div></p>
            <p>Topic: <div class="tag">{{ petition.topic }}</div></p>
        </div>
        <div class="information">
            <p>Problem: {{ petition.problem }}</p>
            <p>Proposed Solution: {{ petition.solution }}</p>
            <p>Restaurant Response: {{ response.explanation }}</p>
        </div>
    </div>
    <div class="feedback">
        <p>Effectiveness: {{ (averageEffectiveness >= 0)? averageEffectiveness.toFixed(1): "-" }}</p>
        <PetitionFeedbackListComponent :response="response" />
    </div>
</template>

<style scoped>
</style>