import { defineStore } from "pinia";
import { ref } from "vue";

export const useRestrictionStore = defineStore(
  "restriction",
  () => {
    const restrictions = ref([
      "Low Carbs",
      "Eggs",
      "Low-Fat",
      "Fish",
      "Gluten-Free",
      "GMO-Free",
      "Halal",
      "Keto",
      "Kosher",
      "Lactose-Free",
      "Meat",
      "Mediterranean",
      "Organic",
      "Paleo",
      "Palm Oil",
      "Peanuts",
      "Pescatarian",
      "Low Salt",
      "Shellfish",
      "Soy",
      "Low Sugar",
      "Tree Nuts",
      "Vegan",
      "Vegetarian",
      "Other",
    ]);

    return {
      restrictions,
    };
  },
  { persist: true },
);
