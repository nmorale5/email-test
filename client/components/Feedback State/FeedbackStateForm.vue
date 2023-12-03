<script setup lang="ts">
import { ref } from "vue";

const rating = ref(0);
const effectiveness = ref(0);
const stars = ref([1, 2, 3, 4, 5])
const hover = ref(0)
const props = defineProps(['response'])


const updateRating = async (star: number) => {
    // check if there already exists a rating
    // If not, create a new rating
    // If so, update the rating
    rating.value = star;
}

const hoverRating = async (star:number) => {
    hover.value = star
}

const resetHover = async () => {
    hover.value = 0
}

const getEffectiveness = async () => {
    //route for getting rating
    // get average rating
}
</script>

<template>
    <div>
        <p>Response: {{ props.response.explanation}}</p>
    </div>
    <div class="feedback-info">
        <div>
            <i>Effectiveness: {{ (effectiveness)? (effectiveness.toFixed(1)) : "-" }}</i>
        </div>
        <div class="rating">
            <div>Your Rating: </div>
            <span v-for="star in stars" :key="star" @click="updateRating(star)"
                @mouseover="hoverRating(star)"
                @mouseleave="resetHover"
                :class="{ 'active': star <= rating || star <= hover }"></span>
        </div>
    </div>
</template>

<style scoped>
.feedback-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.rating {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.rating span {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background-image: url('../../assets/images/black-star.png'); /* Replace with your star image */
    background-size: cover;
    margin-right: 5px;
}

.rating span:hover,
.rating span.active,
.rating span.active:hover {
    background-image: url('../../assets/images/gold-star.png'); /* Replace with your filled star image */
}
</style>