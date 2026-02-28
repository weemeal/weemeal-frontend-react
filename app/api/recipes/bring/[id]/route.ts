import {NextRequest, NextResponse} from 'next/server';
import {recipeRepository} from '@/lib/mongodb/repositories/RecipeRepository';
import {generateBringHtml} from '@/lib/utils/generateBringHtml';
import {Recipe} from '@/types/recipe';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/recipes/bring/[id] - Get recipe HTML for Bring integration
export async function GET(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params;
        const recipeDoc = await recipeRepository.findById(id);

        if (!recipeDoc) {
            return NextResponse.json(
                {error: 'Recipe not found'},
                {status: 404}
            );
        }

        // Convert MongoDB document to Recipe type
        const recipe: Recipe = {
            _id: recipeDoc._id.toString(),
            name: recipeDoc.name,
            recipeYield: recipeDoc.recipeYield,
            recipeInstructions: recipeDoc.recipeInstructions,
            ingredientListContent: recipeDoc.ingredientListContent.map((content) => {
                if (content.contentType === 'INGREDIENT') {
                    return {
                        contentId: content.contentId,
                        contentType: 'INGREDIENT' as const,
                        position: content.position,
                        ingredientName: content.ingredientName || '',
                        unit: content.unit,
                        amount: content.amount,
                    };
                } else {
                    return {
                        contentId: content.contentId,
                        contentType: 'SECTION_CAPTION' as const,
                        position: content.position,
                        sectionName: content.sectionName || '',
                    };
                }
            }),
        };

        const html = generateBringHtml(recipe);

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Error generating Bring HTML:', error);
        return NextResponse.json(
            {error: 'Failed to generate recipe HTML'},
            {status: 500}
        );
    }
}
