import {IngredientListContent} from "./ingredient";

export interface Recipe {
    recipeId: string;
    name: string;
    recipeYield: number;
    recipeInstructions: string;
    ingredientListContent: IngredientListContent[];
}