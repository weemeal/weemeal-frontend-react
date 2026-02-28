import {NextRequest, NextResponse} from 'next/server';
import {recipeRepository} from '@/lib/mongodb/repositories/RecipeRepository';
import {getRecipeImage} from '@/lib/utils/recipeImageService';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/recipes/[id]/image
 * Get the image URL for a recipe
 * Query params:
 *   - regenerate=true: Force generate a new image even if one exists
 *   - name=string: Use this name for image generation (for unsaved name changes)
 */
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

        const regenerate = request.nextUrl.searchParams.get('regenerate') === 'true';
        const customName = request.nextUrl.searchParams.get('name');

        // If recipe already has an image and we're not regenerating, return it
        if (recipe.imageUrl && !regenerate) {
            return NextResponse.json({
                imageUrl: recipe.imageUrl,
                source: 'stored',
            });
        }

        // Generate a new image using custom name or recipe name
        const nameForImage = customName || recipe.name;
        const imageResult = await getRecipeImage(nameForImage);

        return NextResponse.json({
            imageUrl: imageResult.url,
            attribution: imageResult.attribution,
            source: imageResult.source,
        });
    } catch (error) {
        console.error('Error getting recipe image:', error);
        return NextResponse.json(
            {error: 'Failed to get recipe image'},
            {status: 500}
        );
    }
}

/**
 * POST /api/recipes/[id]/image
 * Generate and save a new image for the recipe
 */
export async function POST(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params;
        const recipe = await recipeRepository.findById(id);

        if (!recipe) {
            return NextResponse.json(
                {error: 'Recipe not found'},
                {status: 404}
            );
        }

        // Get request body for custom image URL
        let imageUrl: string;
        let source: string = 'generated';

        const contentType = request.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            const body = await request.json();
            if (body.imageUrl) {
                // Custom image URL provided
                imageUrl = body.imageUrl;
                source = 'custom';
            } else {
                // Generate new image
                const imageResult = await getRecipeImage(recipe.name);
                imageUrl = imageResult.url;
                source = imageResult.source;
            }
        } else {
            // No body, generate new image
            const imageResult = await getRecipeImage(recipe.name);
            imageUrl = imageResult.url;
            source = imageResult.source;
        }

        // Save the image URL
        await recipeRepository.update(id, {imageUrl});

        return NextResponse.json({
            imageUrl,
            source,
            message: 'Image saved successfully',
        });
    } catch (error) {
        console.error('Error saving recipe image:', error);
        return NextResponse.json(
            {error: 'Failed to save recipe image'},
            {status: 500}
        );
    }
}

/**
 * DELETE /api/recipes/[id]/image
 * Remove the image from a recipe
 */
export async function DELETE(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params;
        const recipe = await recipeRepository.findById(id);

        if (!recipe) {
            return NextResponse.json(
                {error: 'Recipe not found'},
                {status: 404}
            );
        }

        // Remove the image URL by setting it to undefined
        await recipeRepository.update(id, {imageUrl: undefined as unknown as string});

        return NextResponse.json({
            message: 'Image removed successfully',
        });
    } catch (error) {
        console.error('Error removing recipe image:', error);
        return NextResponse.json(
            {error: 'Failed to remove recipe image'},
            {status: 500}
        );
    }
}
