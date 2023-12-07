<script setup lang="ts">
import PetitionComponent from "@/components/Petition/PetitionComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPetitionForm from "./SearchPetitionForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let petitions = ref<Array<Record<string, string>>>([]);
let searchTitle = ref("");

async function getPetitions(search?: string) {
  //let query: Record<string, string> = author !== undefined ? { author } : {};

  let petitionResults;
  try {
    if (search !== undefined && search !== "") {
      petitionResults = await fetchy(`/api/petitions/filter/${search}`, "GET");
    } else {
      petitionResults = await fetchy("/api/petitions/all", "GET");
    }
  } catch (_) {
    return;
  }
  searchTitle.value = search ? search : "";
  petitions.value = petitionResults;
}

onBeforeMount(async () => {
  await getPetitions();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2 v-if="!searchTitle">All Petitions:</h2>
    <h2 v-else>Petitions matching: "{{ searchTitle }}":</h2>
    <SearchPetitionForm @getPetitionsByTitle="getPetitions" />
  </div>
  <section class="petitions" v-if="loaded && petitions.length !== 0">
    <article v-for="petition in petitions" :key="petition._id">
      <PetitionComponent :petition="petition" @refreshPetitions="getPetitions" />
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
p,
.row {
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
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
