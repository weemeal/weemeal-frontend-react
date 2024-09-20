import {Ingredient} from "./ingredient";

export interface Recipe {
    recipeId: string;
    name: string;
    recipeYield: number;
    recipeInstructions: string;
    ingredients: Ingredient[];
}