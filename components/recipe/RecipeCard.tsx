'use client';

import Link from 'next/link';
import {QRCodeSVG} from 'qrcode.react';
import {RecipeResponse} from '@/types/recipe';
import {generateBringUrl} from '@/lib/utils/generateBringUrl';

interface RecipeCardProps {
    recipe: RecipeResponse;
}

export default function RecipeCard({recipe}: RecipeCardProps) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const bringUrl = generateBringUrl({
        recipeId: recipe._id,
        baseUrl,
        baseQuantity: recipe.recipeYield,
        requestedQuantity: recipe.recipeYield,
    });

    const ingredientCount = recipe.ingredientListContent.filter(
        (c) => c.contentType === 'INGREDIENT'
    ).length;

    return (
        <Link href={`/recipe/${recipe._id}`} className="block">
            <div className="recipe-card bg-white">
                {/* Card Header */}
                <div className="p-4 border-b border-border-light">
                    <h2 className="text-lg font-semibold text-text-dark truncate">
                        {recipe.name}
                    </h2>
                </div>

                {/* Card Body */}
                <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        {/* Info */}
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">{recipe.recipeYield}</span> Portionen
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">{ingredientCount}</span> Zutaten
                            </p>
                        </div>

                        {/* QR Code (hidden until hover on desktop) */}
                        <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:block hidden">
                            <div className="w-16 h-16">
                                <QRCodeSVG value={bringUrl} size={64}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
