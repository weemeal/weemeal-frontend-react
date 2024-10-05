import {useEffect, useState} from 'react';
import {fetchRecipeById} from '../Api';
import {Recipe} from "../types/recipe";

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
                        const sortedIngredients = [...recipe.ingredients].sort((a, b) => a.position - b.position);
                        setRecipe({...recipe, ingredients: sortedIngredients});
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
                setLoading(false);
            }
        };
        loadRecipe();
    }, [id]);

    return {recipe, setRecipe, loading, error};
};
