import {NextRequest, NextResponse} from 'next/server';
import {generateRecipeTags} from '@/lib/utils/generateTags';

/**
 * POST /api/recipes/generate-tags
 * Generate tags for a recipe based on name and ingredients
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {name, ingredients} = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json(
                {error: 'Recipe name is required'},
                {status: 400}
            );
        }

        // Extract ingredient names from the content array if provided
        let ingredientNames: string[] = [];
        if (Array.isArray(ingredients)) {
            ingredientNames = ingredients
                .filter((item: { contentType?: string; ingredientName?: string }) =>
                    item.contentType === 'INGREDIENT' && item.ingredientName
                )
                .map((item: { ingredientName: string }) => item.ingredientName);
        }

        const tags = await generateRecipeTags({
            name,
            ingredients: ingredientNames,
        });

        return NextResponse.json({tags});
    } catch (error) {
        console.error('Error generating tags:', error);
        return NextResponse.json(
            {error: 'Failed to generate tags'},
            {status: 500}
        );
    }
}
