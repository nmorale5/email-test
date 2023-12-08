<script setup lang="ts">
import BadgeList from "@/components/Badges/BadgeList.vue";
import PetitionComponent from "../Petition/PetitionComponent.vue";
import ResponseFormComponent from "../Response/ResponseFormComponent.vue";

const { restaurant, petitions, badges } = defineProps(["restaurant", "petitions", "badges"]);
</script>
<template>
  <header>
    <h2>{{ restaurant.name }}</h2>
    <BadgeList :badges="badges" />
  </header>
  <h3>Petitions:</h3>
  <p v-if="petitions.length === 0"><em>None</em></p>
  <div v-else v-for="petition in petitions">
    <PetitionComponent
      :key="petition._id"
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
    <ResponseFormComponent
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
