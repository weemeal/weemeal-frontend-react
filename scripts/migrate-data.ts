/**
 * Data Migration Script: PostgreSQL → MongoDB
 *
 * This script migrates recipe data from the old Spring Boot/PostgreSQL backend
 * to the new Next.js/MongoDB backend.
 *
 * Prerequisites:
 * 1. Export data from PostgreSQL as JSON
 * 2. Ensure MongoDB is running (docker-compose up -d)
 * 3. Set MONGODB_URI environment variable
 *
 * Usage:
 * npx tsx scripts/migrate-data.ts <path-to-json-file>
 */

import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
import path from 'path';

// Type definitions for legacy PostgreSQL data
interface LegacyIngredient {
    contentId?: string;
    ingredientName: string;
    unit?: string;
    amount?: number | string;
    position: number;
    contentType: 'INGREDIENT';
}

interface LegacySectionCaption {
    contentId?: string;
    sectionName: string;
    position: number;
    contentType: 'SECTION_CAPTION';
}

type LegacyContent = LegacyIngredient | LegacySectionCaption;

interface LegacyRecipe {
    recipeId: string; // UUID from PostgreSQL
    name: string;
    recipeYield: number;
    recipeInstructions: string;
    ingredientListContent: LegacyContent[];
}

// MongoDB Schema (inline for migration script)
const IngredientListContentSchema = new mongoose.Schema(
    {
        contentId: {type: String, required: true},
        contentType: {
            type: String,
            required: true,
            enum: ['INGREDIENT', 'SECTION_CAPTION']
        },
        position: {type: Number, required: true},
        ingredientName: {type: String},
        unit: {type: String},
        amount: {type: Number},
        sectionName: {type: String},
    },
    {_id: false}
);

const RecipeSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        recipeYield: {type: Number, required: true},
        recipeInstructions: {type: String, default: ''},
        ingredientListContent: {type: [IngredientListContentSchema], default: []},
        userId: {type: String},
        legacyId: {type: String}, // Store original UUID for reference
    },
    {timestamps: true}
);

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

async function connectToMongoDB(): Promise<void> {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
}

function transformRecipe(legacy: LegacyRecipe): {
    name: string;
    recipeYield: number;
    recipeInstructions: string;
    ingredientListContent: Array<{
        contentId: string;
        contentType: 'INGREDIENT' | 'SECTION_CAPTION';
        position: number;
        ingredientName?: string;
        unit?: string;
        amount?: number;
        sectionName?: string;
    }>;
    legacyId: string;
} {
    const ingredientListContent = legacy.ingredientListContent.map((content) => {
        // Ensure each item has a contentId
        const contentId = content.contentId || uuidv4();

        if (content.contentType === 'INGREDIENT') {
            const ingredient = content as LegacyIngredient;
            return {
                contentId,
                contentType: 'INGREDIENT' as const,
                position: ingredient.position,
                ingredientName: ingredient.ingredientName,
                unit: ingredient.unit || undefined,
                amount: typeof ingredient.amount === 'string'
                    ? parseFloat(ingredient.amount) || undefined
                    : ingredient.amount,
            };
        } else {
            const section = content as LegacySectionCaption;
            return {
                contentId,
                contentType: 'SECTION_CAPTION' as const,
                position: section.position,
                sectionName: section.sectionName,
            };
        }
    });

    // Sort by position
    ingredientListContent.sort((a, b) => a.position - b.position);

    return {
        name: legacy.name,
        recipeYield: legacy.recipeYield,
        recipeInstructions: legacy.recipeInstructions || '',
        ingredientListContent,
        legacyId: legacy.recipeId,
    };
}

async function migrateRecipes(recipes: LegacyRecipe[]): Promise<{
    success: number;
    failed: number;
    errors: string[];
}> {
    const results = {
        success: 0,
        failed: 0,
        errors: [] as string[],
    };

    for (const legacyRecipe of recipes) {
        try {
            const transformed = transformRecipe(legacyRecipe);

            // Check if recipe with this legacyId already exists
            const existing = await Recipe.findOne({legacyId: transformed.legacyId});
            if (existing) {
                console.log(`Skipping existing recipe: ${transformed.name} (${transformed.legacyId})`);
                continue;
            }

            const recipe = new Recipe(transformed);
            await recipe.save();

            console.log(`Migrated: ${transformed.name}`);
            results.success++;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            results.errors.push(`Failed to migrate "${legacyRecipe.name}": ${message}`);
            results.failed++;
        }
    }

    return results;
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: npx tsx scripts/migrate-data.ts <path-to-json-file>');
        console.log('');
        console.log('The JSON file should contain an array of recipes in the legacy format:');
        console.log('[');
        console.log('  {');
        console.log('    "recipeId": "uuid",');
        console.log('    "name": "Recipe Name",');
        console.log('    "recipeYield": 4,');
        console.log('    "recipeInstructions": "...",');
        console.log('    "ingredientListContent": [...]');
        console.log('  }');
        console.log(']');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    console.log(`Reading recipes from: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const recipes: LegacyRecipe[] = JSON.parse(fileContent);

    console.log(`Found ${recipes.length} recipes to migrate`);

    try {
        await connectToMongoDB();

        const results = await migrateRecipes(recipes);

        console.log('');
        console.log('Migration complete!');
        console.log(`  Successfully migrated: ${results.success}`);
        console.log(`  Failed: ${results.failed}`);

        if (results.errors.length > 0) {
            console.log('');
            console.log('Errors:');
            results.errors.forEach((error) => console.log(`  - ${error}`));
        }
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

main();
