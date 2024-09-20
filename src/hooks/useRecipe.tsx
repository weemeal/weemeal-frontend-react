import {useEffect, useState} from 'react';
import {fetchRecipeById} from '../Api';

export const useRecipe = (id?: string) => {  // id als optionaler Parameter
    const [recipe, setRecipe] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const loadRecipe = async () => {
            if (id) {  // Überprüfen, ob id vorhanden ist
                try {
                    const data = await fetchRecipeById(id);
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