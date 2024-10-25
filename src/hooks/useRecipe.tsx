import {useEffect, useState} from 'react';
import {fetchRecipeById} from '../Api';
import {Recipe} from "../types/recipe";
import {IngredientListContent} from "../types/ingredient";
import {v4 as uuidv4} from 'uuid';

export const useRecipe = (id?: string) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const loadRecipe = async () => {
            if (id) {
                try {
                    const recipe: Recipe = await fetchRecipeById(id);
                    if (recipe) {
                        const sortedContent: IngredientListContent[] = [...recipe.ingredientListContent].sort((a, b) => a.position - b.position);
                        setRecipe({...recipe, ingredientListContent: sortedContent});
                    } else {
                        setError(true);
                    }
                } catch (err) {
                    console.error(err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            } else {
                setRecipe({
                    recipeId: uuidv4(),
                    name: '',
                    recipeYield: 1,
                    recipeInstructions: '',
                    ingredientListContent: [],
                });
                setLoading(false);
            }
        };
        loadRecipe();
    }, [id]);

    return {recipe, setRecipe, loading, error};
};
