/**
 * Import recipes from weemealbackend.darthkali.com
 * and store them in local MongoDB with generated images
 *
 * Usage: npx tsx scripts/import-from-backend.ts
 */

/* eslint-disable @typescript-eslint/no-require-imports */

// Load .env.local FIRST before any other imports
import * as dotenv from 'dotenv';
import * as path from 'path';
// Now import other modules
import mongoose from 'mongoose';
import Recipe from '../lib/mongodb/models/Recipe';
import {getRecipeImage} from '../lib/utils/recipeImageService';

dotenv.config({path: path.resolve(process.cwd(), '.env.local')});

const BACKEND_URL = 'https://weemealbackend.darthkali.com/api/recipes/';
const MONGODB_URI = process.env.MONGODB_URI!;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

console.log('Environment loaded:');
console.log('  MONGODB_URI:', MONGODB_URI ? 'set' : 'NOT SET');
console.log('  UNSPLASH_ACCESS_KEY:', UNSPLASH_KEY ? 'set' : 'NOT SET');
console.log('  ANTHROPIC_API_KEY:', ANTHROPIC_KEY ? 'set' : 'NOT SET');
console.log('');

interface BackendIngredient {
    contentType: 'INGREDIENT';
    id: string;
    position: number;
    ingredientName: string;
    unit: string | null;
    amount: number | null;
}

interface BackendSection {
    contentType: 'SECTION_CAPTION';
    id: string;
    position: number;
    sectionName: string;
}

type BackendContent = BackendIngredient | BackendSection;

interface BackendRecipe {
    recipeId: string;
    name: string;
    recipeYield: number;
    recipeInstructions: string;
    ingredientListContent: BackendContent[];
}

async function fetchRecipesFromBackend(): Promise<BackendRecipe[]> {
    console.log('Fetching recipes from backend...');
    const response = await fetch(BACKEND_URL);

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const recipes = await response.json();
    console.log(`Found ${recipes.length} recipes`);
    return recipes;
}

function transformRecipe(backendRecipe: BackendRecipe) {
    return {
        name: backendRecipe.name,
        recipeYield: backendRecipe.recipeYield,
        recipeInstructions: backendRecipe.recipeInstructions,
        ingredientListContent: backendRecipe.ingredientListContent.map((content) => {
            if (content.contentType === 'INGREDIENT') {
                return {
                    contentId: content.id,
                    contentType: 'INGREDIENT' as const,
                    position: content.position,
                    ingredientName: content.ingredientName,
                    unit: content.unit || undefined,
                    amount: content.amount || undefined,
                };
            } else {
                return {
                    contentId: content.id,
                    contentType: 'SECTION_CAPTION' as const,
                    position: content.position,
                    sectionName: content.sectionName,
                };
            }
        }),
    };
}

async function generateImageForRecipe(recipeName: string): Promise<string | undefined> {
    try {
        console.log(`  Generating image for "${recipeName}"...`);
        const imageResult = await getRecipeImage(recipeName);
        console.log(`  Image source: ${imageResult.source}`);
        return imageResult.url;
    } catch (error) {
        console.error(`  Error generating image:`, error);
        return undefined;
    }
}

async function importRecipes() {
    console.log('Starting import...\n');

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!\n');

    try {
        // Fetch recipes from backend
        const backendRecipes = await fetchRecipesFromBackend();

        // Ask whether to clear existing data
        console.log('\nClearing existing recipes...');
        await Recipe.deleteMany({});
        console.log('Cleared!\n');

        // Import each recipe
        let imported = 0;
        let failed = 0;

        for (const backendRecipe of backendRecipes) {
            console.log(`\nImporting: ${backendRecipe.name}`);

            try {
                // Transform the recipe
                const recipeData = transformRecipe(backendRecipe);

                // Generate image
                const imageUrl = await generateImageForRecipe(backendRecipe.name);
                if (imageUrl) {
                    (recipeData as Record<string, unknown>).imageUrl = imageUrl;
                }

                // Save to MongoDB
                const recipe = new Recipe(recipeData);
                await recipe.save();

                console.log(`  Saved with ID: ${recipe._id}`);
                imported++;

                // Small delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`  Failed to import:`, error);
                failed++;
            }
        }

        console.log('\n========================================');
        console.log(`Import complete!`);
        console.log(`  Imported: ${imported}`);
        console.log(`  Failed: ${failed}`);
        console.log('========================================\n');
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the import
importRecipes().catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
});
