import { defineStore } from "pinia";
import { ref } from "vue";

export const useRestrictionStore = defineStore(
  "restriction",
  () => {
    const restrictions = ref([
      "Vegan",
      "Vegetarian",
      "Lactose",
      "Gluten",
      "Keto",
      "Paleo",
      "Peanuts",
      "Bio",
      "Soy",
      "Dairy",
      "Low-Fat",
      "Tree Nuts",
      "Palm Oil",
      "Low Sugar",
      "Low Salt",
      "Kosher",
      "Wheat",
      "Eggs",
      "Fish",
      "Shellfish",
      "Low Carbs",
      "Plant-Based",
      "Spicy",
      "Very Spicy",
      "Organic",
      "Halal",
      "Raw",
      "GMO",
      "Gluten-Free",
      "Mediterranean",
      "Celery",
      "Berries",
    ]);

    return {
      restrictions,
    };
  },
  { persist: true },
);
