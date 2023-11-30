<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername, currentUserId } = storeToRefs(useUserStore());
const signed = ref(false);
const signers = ref(0);

const deletePost = async () => {
  try {
    await fetchy(`/api/petition/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const updateSigned = async () => {
  let newSigned: boolean;
  let newSigners: number;
  try {
    newSigned = currentUserId.value !== "" ? await fetchy(`/api/upvote/${props.post._id}/${currentUserId.value}`, "GET") : false;
    newSigners = (await fetchy(`/api/upvote/${props.post._id}`, "GET")).length;
  } catch {
    return;
  }
  signed.value = newSigned;
  signers.value = newSigners;
};

const trySign = async () => {
  try {
    await fetchy(`/api/upvote/${props.post._id}/${currentUserId.value}`, "PUT");
  } catch {
    return;
  } finally {
    await updateSigned();
  }
};

const tryUnsign = async () => {
  try {
    await fetchy(`/api/upvote/${props.post._id}/${currentUserId.value}`, "DELETE");
  } catch {
    return;
  } finally {
    await updateSigned();
  }
};

onBeforeMount(updateSigned);
</script>

<template>
  <p>{{ props.post.title }}</p>
  <p>{{ props.post.target }}</p>
  <p class="author">{{ props.post.creator }}</p>
  <p>{{ props.post.problem }}</p>
  <p>{{ props.post.solution }}</p>

  <p>Signers: {{ signers }}</p>
  <p>Threshold: {{ props.post.upvoteThreshold }}</p>
  <div v-if="currentUserId">
    <button v-if="!signed" @click="trySign">Sign</button>
    <button v-else @click="tryUnsign"><em>Signed!</em></button>
  </div>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
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
