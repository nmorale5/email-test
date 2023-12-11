<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const rating = ref(0);
const effectiveness = ref(0);
const stars = ref([1, 2, 3, 4, 5]);
const hover = ref(0);
const props: any = defineProps(["response"]);
const emit = defineEmits(["refreshPetitions", "refreshFeedback"]);
const feedback = ref("");

const updateRating = async (star: number) => {
  rating.value = star;
};

const hoverRating = async (star: number) => {
  hover.value = star;
};

const resetHover = async () => {
  hover.value = 0;
};

const getEffectiveness = async () => {
  let feedbackList;
  try {
    feedbackList = await fetchy(`/api/feedback/all/userFeedback/${props.response._id}`, "GET");
  } catch (_) {
    return;
  }
  effectiveness.value =
    feedbackList.length > 0 ? feedbackList.map((feedback: any) => feedback.rating).reduce((prevRating: any, currRating: any) => prevRating + currRating, 0) / feedbackList.length : -1;
};

const createFeedback = async () => {
  try {
    await fetchy(`/api/feedback/responses/${props.response._id}`, "POST", {
      body: {
        feedback: feedback.value,
        rating: rating.value,
      },
    });
    await getEffectiveness();
  } catch (e) {
    console.log(e);
  }
  emit("refreshPetitions");
  emit("refreshFeedback");
};
onBeforeMount(async () => {
  await getEffectiveness();
});
</script>

<template>
  <form @submit.prevent="createFeedback">
    <div class="feedback-info">
      <div class="pad">
        <i>Effectiveness: {{ effectiveness >= 0 ? effectiveness.toFixed(1) : "-" }}</i>
      </div>
      <div class="rating">
        <div class="pad">Your Rating:</div>
        <span v-for="star in stars" :key="star" @click="updateRating(star)" @mouseover="hoverRating(star)" @mouseleave="resetHover" :class="{ active: star <= rating || star <= hover }"></span>
      </div>
    </div>
    <div class="feedback">
      <div class="pad" id="feedback-label">Feedback:</div>
      <textarea id="verbal-feedback" v-model="feedback" placeholder="Enter Feedback on the changes made"></textarea>
    </div>
    <div>
      <button type="submit" class="pure-button pure-button-primary">Submit Feedback</button>
    </div>
  </form>
</template>

<style scoped>
.feedback-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating,
.feedback {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.rating span {
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-image: url("../../assets/images/black-star.png"); /* Replace with your star image */
  background-size: cover;
  margin-right: 5px;
}

.pure-button-primary {
  margin: 2px;
}

.pad {
  padding: 2px;
  padding-right: 10px;
}

.rating span:hover,
.rating span.active,
.rating span.active:hover {
  background-image: url("../../assets/images/gold-star.png"); /* Replace with your filled star image */
}

.feedback {
  display: grid;
  gap: 4px 4px;
  padding-bottom: 4px;
}
</style>
