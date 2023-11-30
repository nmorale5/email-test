<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";


const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const loaded = ref(false);
const props = defineProps(["restaurant"]);
const petitions = ref([]);


const getPetitions = async () => {
  try {
    petitions.value = await fetchy(`/api/petitions/business/${props.restaurant.value._id}`, "GET");
    return;
  } catch {
    return;
  }
};

// export interface PetitionDoc extends BaseDoc {
//   title: string;
//   problem: string;
//   solution: string;
//   target: ObjectId;
//   creator: ObjectId;
//   upvoteThreshold: number;
// }

onBeforeMount(async () => {
  await getPetitions();
  loaded.value = true;
});
</script>
<template>
  <h1 v-if="!loaded">Loading...</h1>
  <div v-else>
    <article>
      <h2>All Petitions</h2>
      <ul v-for="petition in petitions">
        <li>Title: { petition.title }</li>
        <li>Problem: { petition.problem }</li>
        <li>Solution: {petition.solution }</li>
        <li>Response Form Here</li>
      </ul>
    </article>
    <article>
      <h2>TODO: Once Response concept implemented, Resolved Petitions</h2>
    </article>
    
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
</style>
