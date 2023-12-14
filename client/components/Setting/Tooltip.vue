<script setup lang="ts">
import { ref } from "vue";

const { displaytext, hovertext } = defineProps(["displaytext", "hovertext"]);
const visible = ref(false);
</script>

<template>
  <div class="tooltip-container">
    <img src="../../assets/images/tooptip.webp" alt="tooltip" @mouseover="visible = true" @mouseleave="visible = false" />
    <div v-if="visible" class="tooltip">
      {{ hovertext }}
    </div>
    <p>{{ displaytext }}</p>
  </div>
</template>

<style scoped>
img {
  width: 32px;
  height: auto;
  padding: 5px;
}

.tooltip-container {
  position: relative;
  display: flex;
  align-items: center; /* Align items vertically */
  justify-content: center; /* Align items horizontally */
}

.tooltip {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -150%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  z-index: 9999;
}

.tooltip-container:hover .tooltip {
  display: block;
}
</style>
