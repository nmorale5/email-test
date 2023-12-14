import { defineStore } from "pinia";
import { ref } from "vue";

export const useRestrictionStore = defineStore(
  "restriction",
  () => {
    const restrictions = ref([
      "Eggs",
      "Fish",
      "Gluten-Free",
      "GMO-Free",
      "Keto",
      "Kosher",
      "Halal",
      "Low Carbs",
      "Low-Fat",
      "Low Salt",
      "Low Sugar",
      "Lactose-Free",
      "Mediterranean",
      "Organic",
      "Palm Oil",
      "Paleo",
      "Peanuts",
      "Shellfish",
      "Soy",
      "Tree Nuts",
      "Vegan",
      "Vegetarian",
      "Wheat",
    ]);

    return {
      restrictions,
    };
  },
  { persist: true },
);
