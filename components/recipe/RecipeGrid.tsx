'use client';

import {RecipeResponse} from '@/types/recipe';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
    recipes: RecipeResponse[];
}

export default function RecipeGrid({recipes}: RecipeGridProps) {
    if (recipes.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    Keine Rezepte gefunden.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    Erstelle dein erstes Rezept!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
                <div key={recipe._id} className="group">
                    <RecipeCard recipe={recipe}/>
                </div>
            ))}
        </div>
    );
}
