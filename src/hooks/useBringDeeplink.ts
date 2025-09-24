import {useEffect, useState} from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

export const useBringDeeplink = (recipeId?: string) => {
    const [deeplinkUrl, setDeeplinkUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!recipeId) return;

        const getBringDeeplink = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE_URL}/api/recipes/bring/deeplink/${recipeId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch recipe with id: ${recipeId}`);
                }
                const url = await response.text();
                setDeeplinkUrl(url);
                console.log(url);
            } catch (error) {
                console.error('Failed to load deeplink:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        getBringDeeplink();
    }, [recipeId]);

    return {deeplinkUrl, loading, error};
};