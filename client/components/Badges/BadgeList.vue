<script setup lang="ts">
const props = defineProps(["badges"]);
</script>

<template>
  <ul>
    Badges:
    <li v-if="props.badges.length === 0"><em>None</em></li>
    <li v-else v-for="badge in props.badges" :key="badge.name">
      {{ badge.name }}
      x{{ badge.count }}
    </li>
  </ul>
</template>
