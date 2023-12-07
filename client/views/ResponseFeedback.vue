<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import PetitionFeedbackListComponent from "../components/Feedback State/PetitionFeedbackListComponent.vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["petition", "response"]);
const averageEffectiveness = ref(0)

const convertIDtoName = async () => {
    let restaurant;
    try {
        restaurant = await fetchy(`/api/business/id/${props.petition.target}`, "GET");
    } catch (e) {
        return;
    }
    props.petition.target = restaurant.name;
}

const getEffectiveness =async () => {
    let feedbackList;
    let query: Record<string, string> = props.response !== undefined ? {response: props.response._id} : {};
    try {
        feedbackList = await fetchy(`/api/feedback/all/userFeedback/`, "GET", query)
    } catch (_) {
        return;
    }
    averageEffectiveness.value = (feedbackList.length > 0)? feedbackList.map((feedback: any) => feedback.rating).reduce((prevRating: any, currRating: any)=> prevRating+currRating, 0)/feedbackList.length : -1;
}

onBeforeMount(async () => {
    await convertIDtoName();
    await getEffectiveness();

});
</script>

<template>
    <div class="response-info">
        <div class="selectables">
            <p>Restaurant: <div class="tag">{{ props.petition.target }}</div></p>
            <p>Topic: <div class="tag">{{ props.petition.topic }}</div></p>
        </div>
        <div class="information">
            <p>Problem: {{ props.petition.problem }}</p>
            <p>Proposed Solution: {{ props.petition.solution }}</p>
            <p>Restaurant Response: {{ props.response.explanation }}</p>
        </div>
    </div>
    <div class="feedback">
        <p>Effectiveness: {{ (averageEffectiveness >= 0)? averageEffectiveness.toFixed(1): "-" }}</p>
        <PetitionFeedbackListComponent :response="props.response" />
    </div>
</template>

<style scoped>
</style>