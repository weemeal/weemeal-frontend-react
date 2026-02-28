'use client';

import {useCallback, useEffect, useState} from 'react';

interface UsePortionsResult {
    portions: number;
    setPortions: (portions: number) => void;
    increase: () => void;
    decrease: () => void;
    multiplier: number;
}

export function usePortions(
    recipeId: string,
    defaultPortions: number
): UsePortionsResult {
    const storageKey = `recipe-portions-${recipeId}`;

    const [portions, setPortionsState] = useState(defaultPortions);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            const parsed = parseInt(stored, 10);
            if (!isNaN(parsed) && parsed > 0) {
                setPortionsState(parsed);
            }
        }
    }, [storageKey]);

    // Save to localStorage when portions change
    useEffect(() => {
        localStorage.setItem(storageKey, String(portions));
    }, [storageKey, portions]);

    const setPortions = useCallback((newPortions: number) => {
        setPortionsState(Math.max(1, Math.min(100, newPortions)));
    }, []);

    const increase = useCallback(() => {
        setPortionsState((prev) => Math.min(100, prev + 1));
    }, []);

    const decrease = useCallback(() => {
        setPortionsState((prev) => Math.max(1, prev - 1));
    }, []);

    const multiplier = portions / defaultPortions;

    return {portions, setPortions, increase, decrease, multiplier};
}

export default usePortions;
