import {NextRequest, NextResponse} from 'next/server';
import {recipeRepository} from '@/lib/mongodb/repositories/RecipeRepository';
import {validateRecipeUpdate} from '@/lib/validations/recipeSchema';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/recipes/[id] - Get a single recipe
export async function GET(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params;
        const recipe = await recipeRepository.findById(id);

        if (!recipe) {
            return NextResponse.json(
                {error: 'Recipe not found'},
                {status: 404}
            );
        }

        const response = {
            _id: recipe._id.toString(),
            name: recipe.name,
            recipeYield: recipe.recipeYield,
            recipeInstructions: recipe.recipeInstructions,
            ingredientListContent: recipe.ingredientListContent,
            userId: recipe.userId,
            createdAt: recipe.createdAt?.toISOString(),
            updatedAt: recipe.updatedAt?.toISOString(),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return NextResponse.json(
            {error: 'Failed to fetch recipe'},
            {status: 500}
        );
    }
}

// PUT /api/recipes/[id] - Update a recipe
export async function PUT(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params;
        const body = await request.json();

        // Validate input
        const validation = validateRecipeUpdate(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.errors?.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                },
                {status: 400}
            );
        }

        const recipe = await recipeRepository.update(id, validation.data!);

        if (!recipe) {
            return NextResponse.json(
                {error: 'Recipe not found'},
                {status: 404}
            );
        }

        const response = {
            _id: recipe._id.toString(),
            name: recipe.name,
            recipeYield: recipe.recipeYield,
            recipeInstructions: recipe.recipeInstructions,
            ingredientListContent: recipe.ingredientListContent,
            userId: recipe.userId,
            createdAt: recipe.createdAt?.toISOString(),
            updatedAt: recipe.updatedAt?.toISOString(),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error updating recipe:', error);
        return NextResponse.json(
            {error: 'Failed to update recipe'},
            {status: 500}
        );
    }
}

// DELETE /api/recipes/[id] - Delete a recipe
export async function DELETE(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params;
        const deleted = await recipeRepository.delete(id);

        if (!deleted) {
            return NextResponse.json(
                {error: 'Recipe not found'},
                {status: 404}
            );
        }

        return NextResponse.json({success: true}, {status: 200});
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return NextResponse.json(
            {error: 'Failed to delete recipe'},
            {status: 500}
        );
    }
}
