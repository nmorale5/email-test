<script setup lang="ts">
import BadgeList from "@/components/Badges/BadgeList.vue";
import PostComponent from "../Post/PostComponent.vue";

const { restaurant, petitions, badges } = defineProps(["restaurant", "petitions", "badges"]);
</script>
<template>
  <header>
    <h2>{{ restaurant.name }}</h2>
    <BadgeList :badges="badges" />
  </header>
  <!-- TODO: replace PostComponent with PetitionComponent once made -->
  <h3>Petitions:</h3>
  <p v-if="petitions.length === 0"><em>None</em></p>
  <PostComponent
    v-else
    v-for="petition in petitions"
    :key="petition._id"
    :post="{ _id: petition._id, author: petition.creator, content: petition.title, dateUpdated: petition.dateUpdated, dateCreated: petition.dateCreated }"
  />
</template>
