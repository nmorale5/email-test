<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRestrictionStore } from "../../stores/restrictions";
const props = defineProps(["badges"]);
const { restrictions } = storeToRefs(useRestrictionStore());

const getBadgeIconFile = (badgeName: string) => {
  const idx = restrictions.value.indexOf(badgeName);
  if (idx === -1) {
    return;
  }
  return `/client/assets/images/tile${idx.toString().padStart(3, "0")}.png`;
};
</script>

<template>
  <p v-if="props.badges.length === 0"><em>no badges yet!</em></p>
  <section v-else v-for="badge in props.badges" :key="badge.name">
    <img :src="getBadgeIconFile(badge.name)" :alt="badge.name" />
    x{{ badge.count }}
  </section>
</template>

<style scoped>
img {
  width: 32px;
  height: auto;
  border: 1px solid black;
  border-radius: 10%;
}
</style>
