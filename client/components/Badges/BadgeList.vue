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
  return `/tile${idx.toString().padStart(3, "0")}.png`;
};
</script>

<template>
  <p v-if="props.badges.length === 0"><em>no badges yet!</em></p>
  <div v-else class="badge-list">
    <section v-for="badge in props.badges" :key="badge.name">
      <img :src="getBadgeIconFile(badge.name)" :alt="badge.name" />
      <p>x{{ badge.count }}</p>
    </section>
  </div>
</template>

<style scoped>
img {
  width: 64px;
  height: auto;
  border: 1px solid black;
  border-radius: 10%;
}

.badge-list {
  display: flex;
  align-items: center;

}

section {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

section p{
  font-size: 20px;
}
</style>
