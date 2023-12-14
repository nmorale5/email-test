<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { useToastStore } from "../../stores/toast";
import { fetchy } from "../../utils/fetchy";

const { isLoggedIn} = useUserStore();
const rating = ref(0);
const stars = ref([1, 2, 3, 4, 5]);
const hover = ref(0);
const props: any = defineProps(["response"]);
const emit = defineEmits(["refreshPetitions", "refreshFeedback"]);
const feedback = ref("");
const { showToast} = useToastStore();

const updateRating = async (star: number) => {
  rating.value = star;
};

const hoverRating = async (star: number) => {
  hover.value = star;
};

const resetHover = async () => {
  hover.value = 0;
};

const createFeedback = async () => {
  if(rating.value === 0){
    showToast({message: "You must select a star rating value", style: "error"});
    return;
  }
  try {
    await fetchy(`/api/feedback/responses/${props.response._id}`, "POST", {
      body: {
        feedback: feedback.value,
        rating: rating.value,
      },
    });
  } catch (e) {
    console.log(e);
  }
  emit("refreshPetitions");
  emit("refreshFeedback");
};
</script>

<template>
  <form v-if="isLoggedIn" @submit.prevent="createFeedback">
    <div class="rating">
      <div class="pad">Your Rating:</div>
      <span v-for="star in stars" :key="star" @click="updateRating(star)" @mouseover="hoverRating(star)" @mouseleave="resetHover" :class="{ active: star <= rating || star <= hover }"></span>
    </div>
    <div class="feedback">
      <div class="pad" id="feedback-label">Feedback:</div>
      <textarea id="verbal-feedback" v-model="feedback" placeholder="Enter Feedback on the changes made" required></textarea>
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
  background-image: url("../../assets/images/black-star.png");
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
  background-image: url("../../assets/images/gold-star.png");
}

.feedback {
  display: grid;
  gap: 4px 4px;
  padding-bottom: 4px;
}
</style>
