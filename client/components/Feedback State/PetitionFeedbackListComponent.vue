<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["response"]);
const { currentUsername } = storeToRefs(useUserStore());
const feedbackList: any = ref([]);

async function getFeedback(){
    let listOfFeedback;
    let query: Record<string, string> = props.response !== undefined ? {response: props.response._id} : {};
    try {
        listOfFeedback = (await fetchy(`/api/feedback/all/userFeedback/`, "GET", query)).map(async (feedback:any) => {
            return {
                author: await fetchy(`/users/id/${feedback.author}`, "GET"),
                rating: feedback.rating,
                feedback: feedback.feedback,
            }
        });
    } catch (_) {
    return;
  }

  feedbackList.value = listOfFeedback;
}

onBeforeMount(async () => {
  await getFeedback();
});
</script>
<template>
    <section v-for="feedback in feedbackList">
        <section class="feedback">
            <p>{{ feedback.author }}</p>
            <p>{{ feedback.rating }}/5</p>
            <p>{{ feedback.feedback }}</p>
        </section>
    </section>
</template>
<style scoped>
</style>