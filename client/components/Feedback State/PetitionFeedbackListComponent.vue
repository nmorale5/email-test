<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onUpdated, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["response", "feedbackList"]);
const { currentUsername } = storeToRefs(useUserStore());
const feedbackList: any = ref([]);

async function getFeedback(){
    let listOfFeedback;
    try {
        const initialFeedback = await fetchy(`/api/feedback/all/userFeedback/${props.response._id}`, "GET")
        const authors = await Promise.all(
            initialFeedback.map(async (feedback:any) => await fetchy(`/api/users/id/${feedback.user}`, "GET")));
        console.log(authors)
        listOfFeedback = initialFeedback.map((feedback:any, i: number, a: Array<any>) => {
            return {
                author: authors[i].username,
                rating: feedback.rating,
                feedback: feedback.feedback,
            }
        });
    } catch (_) {
        console.log(_)
        return;
    }
    feedbackList.value = listOfFeedback;
}

onUpdated(async () => {
    await getFeedback();
});
</script>
<template>
    <section v-for="feedback in feedbackList">
        <section class="feedback">
            <div class="top">
                <p><b>{{ feedback.author }}</b> - {{ feedback.rating }}/5</p>
            </div>
            <div class="bottom">
                <p>{{ feedback.feedback }}</p>
            </div>
        </section>
    </section>
</template>
<style scoped>
.feedback {
    display: flex;
    flex-direction: column;
}

.top, .bottom {
    display: flex;
}

p {
    padding-right: 16px;
}

.top p {
    margin-bottom: 2px;
}

.bottom p {
    margin-top: 2px;
}
</style>