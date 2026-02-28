'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {RecipeResponse} from '@/types/recipe';
import RecipeGrid from '@/components/recipe/RecipeGrid';
import RecipeSearchBar from '@/components/recipe/RecipeSearchBar';

export default function HomePage() {
    const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/api/recipes');
                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                const data = await response.json();
                setRecipes(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const filteredRecipes = useMemo(() => {
        if (!searchQuery.trim()) {
            return recipes;
        }
        const lowerQuery = searchQuery.toLowerCase();
        return recipes.filter((recipe) =>
            recipe.name.toLowerCase().includes(lowerQuery)
        );
    }, [recipes, searchQuery]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="spinner"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-error text-lg">Fehler: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary mt-4"
                >
                    Erneut versuchen
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-text-dark">Meine Rezepte</h1>
                <Link href="/recipe/new" className="btn btn-primary flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4"/>
                    Neues Rezept
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md">
                <RecipeSearchBar onSearch={handleSearch}/>
            </div>

            {/* Recipe Grid */}
            <RecipeGrid recipes={filteredRecipes}/>
        </div>
    );
}
