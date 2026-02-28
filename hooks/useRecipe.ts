'use client';

import {useCallback, useEffect, useState} from 'react';
import {RecipeResponse} from '@/types/recipe';

interface UseRecipeResult {
    recipe: RecipeResponse | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useRecipe(id: string | null): UseRecipeResult {
    const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecipe = useCallback(async () => {
        if (!id) {
            setRecipe(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/recipes/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Rezept nicht gefunden');
                }
                throw new Error('Fehler beim Laden des Rezepts');
            }
            const data = await response.json();
            setRecipe(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
            setRecipe(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRecipe();
    }, [fetchRecipe]);

    return {recipe, isLoading, error, refetch: fetchRecipe};
}

export default useRecipe;
