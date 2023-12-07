import { defineStore } from "pinia";
import { ref } from "vue";

export const useRestrictionStore = defineStore(
  "restriction",
  () => {
    const restrictions = ref([
      "Vegetarian",
      "Vegan",
      "Pescatarian",
      "Gluten-Free",
      "Lactose-Free",
      "Nut-Free",
      "Shellfish-Free",
      "Soy-Free",
      "Egg-Free",
      "Halal",
      "Kosher",
      "Wheat-Free",
      "Fish-Free",
      "Other",
    ]);

    return {
      restrictions,
    };
  },
  { persist: true },
);
