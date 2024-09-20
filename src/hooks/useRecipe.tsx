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
                    const data: Recipe = await fetchRecipeById(id);
                    if (data) {
                        setRecipe(data);
                    } else {
                        setError(true);
                    }
                } catch (err) {
                    console.error(err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadRecipe();
    }, [id]);

    return {recipe, loading, error};
};