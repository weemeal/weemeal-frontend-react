import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
import {recipeRepository} from '@/lib/mongodb/repositories/RecipeRepository';
import {z} from 'zod';

interface RouteParams {
    params: Promise<{ id: string }>;
}

const NotesSchema = z.object({
    notes: z.string().max(5000),
});

// PATCH /api/recipes/[id]/notes - Update only the notes field
export async function PATCH(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params;
        const body = await request.json();

        // Validate input
        const validation = NotesSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                },
                {status: 400}
            );
        }

        const recipe = await recipeRepository.update(id, {notes: validation.data.notes});

        if (!recipe) {
            return NextResponse.json(
                {error: 'Recipe not found'},
                {status: 404}
            );
        }

        // Revalidate cache for this recipe
        revalidatePath(`/recipe/${id}`);

        return NextResponse.json({
            success: true,
            notes: recipe.notes || '',
        });
    } catch (error) {
        console.error('Error updating notes:', error);
        return NextResponse.json(
            {error: 'Failed to update notes'},
            {status: 500}
        );
    }
}
