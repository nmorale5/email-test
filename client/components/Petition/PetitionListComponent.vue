<script setup lang="ts">
import PetitionComponent from "@/components/Petition/PetitionComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import SearchPetitionForm from "./SearchPetitionForm.vue";

const { isLoggedIn, currentUsername, currentUserId } = storeToRefs(useUserStore());

const loaded = ref(false);
const filterType = ref("all");
const upvoteResults = ref(new Array<Array<string>>());
const allPetitions = ref<Array<Record<string, string>>>([]);
const filteredPetitions = computed(() => {
  if (filterType.value == "all") {
    return allPetitions.value;
  } else if (filterType.value == "signed") {
    return allPetitions.value.filter((p, i) => {
      return upvoteResults.value[i].some((u: any) => u.toString() === currentUserId.value);
    });
  } else if (filterType.value == "created") {
    return allPetitions.value.filter((p) => p.creator === currentUsername.value);
  }
  return allPetitions.value; // should not get here
});
const searchTitle = ref("");

const getPetitions = async (search?: string) => {
  let petitionResults;
  try {
    if (search !== undefined && search !== "") {
      petitionResults = await fetchy(`/api/petitions/filter/${search}`, "GET");
    } else {
      petitionResults = await fetchy("/api/petitions/all", "GET");
    }
    const upvotes = petitionResults.map(async (p: any) => await fetchy(`/api/upvote/${p._id}`, "GET"));
    upvoteResults.value = await Promise.all(upvotes);
  } catch (_) {
    return;
  }
  searchTitle.value = search ? search : "";
  allPetitions.value = petitionResults;
};

onBeforeMount(async () => {
  await getPetitions();
  loaded.value = true;
});
</script>

<template>
  <div>
    <select v-model="filterType" @click="() => getPetitions()">
      <option value="all">All petitions</option>
      <option value="signed">Petitions I've signed</option>
      <option value="created">Petitions I created</option>
    </select>
  </div>
  <div class="row">
    <SearchPetitionForm @getPetitionsByTitle="getPetitions" />
    <h2 v-if="!searchTitle" class="row">{{ filterType === "all" ? "All Petitions" : filterType === "signed" ? "My Signed Petitions" : "My Created Petitions" }}</h2>
    <h2 v-else class="row">Petitions matching: "{{ searchTitle }}":</h2>
  </div>
  <section class="petitions" v-if="loaded && filteredPetitions.length !== 0">
    <article v-for="petition in filteredPetitions" :key="petition._id">
      <PetitionComponent :petition="{
          _id: petition._id,
          creator: petition.creator,
          title: petition.title,
          problem: petition.problem,
          solution: petition.solution,
          upvoteThreshold: petition.upvoteThreshold,
          topic: petition.topic,
          target: petition.target,
          dateUpdated: petition.dateUpdated,
          dateCreated: petition.dateCreated,
        }" @refreshPetitions="getPetitions()" />
    </article>
  </section>
  <p v-else-if="loaded">No petitions found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.petitions {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: right;
  flex-direction: column;
  margin: 0 auto;
  max-width: 60em;
}
</style>
