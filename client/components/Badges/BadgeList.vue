<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRestrictionStore } from "../../stores/restrictions";
const props = defineProps(["badges"]);
const { restrictions } = storeToRefs(useRestrictionStore());

const getBadgeIconFile = (idx: number) => {
  return `../../assets/images/dietaryIcons/tile${idx.toString().padStart(3, "0")}.png`;
};
</script>

<template>
  <ul>
    Badges:
    <li v-if="props.badges.length === 0"><em>None</em></li>
    <li v-else v-for="(badge, i) in props.badges" :key="badge.name">
      <img :src="getBadgeIconFile(i)" :alt="badge.name" />
      x{{ badge.count }}
    </li>
  </ul>
</template>
