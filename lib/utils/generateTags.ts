import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic | null {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return null;
    }
    if (!anthropicClient) {
        anthropicClient = new Anthropic({
            apiKey,
            baseURL: 'https://api.anthropic.com',
        });
    }
    return anthropicClient;
}

interface RecipeData {
    name: string;
    ingredients: string[];
    instructions?: string;
}

/**
 * Generate tags for a recipe using AI
 * Returns an array of relevant tags based on the recipe content
 */
export async function generateRecipeTags(recipe: RecipeData): Promise<string[]> {
    const client = getClient();

    if (!client) {
        console.log('[Tag Generation] No ANTHROPIC_API_KEY configured, using fallback');
        return generateFallbackTags(recipe);
    }

    console.log(`[Tag Generation] Generating tags for: "${recipe.name}"`);

    try {
        const ingredientList = recipe.ingredients.slice(0, 10).join(', ');

        const response = await client.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 200,
            messages: [
                {
                    role: 'user',
                    content: `Generate 3-6 relevant tags for this recipe. Tags should be short (1-2 words), in German, and describe:
- Main dish type (e.g., Suppe, Auflauf, Salat, Pasta)
- Main ingredient category (e.g., Fleisch, Vegetarisch, Fisch)
- Cuisine style if applicable (e.g., Italienisch, Asiatisch)
- Meal type (e.g., Hauptgericht, Beilage, Dessert)
- Special dietary info (e.g., Vegan, Low-Carb, Schnell)

Recipe name: "${recipe.name}"
Main ingredients: ${ingredientList}

Return ONLY the tags as a comma-separated list, nothing else. Example: Vegetarisch, Pasta, Italienisch, Schnell`,
                },
            ],
        });

        const content = response.content[0];
        if (content.type === 'text') {
            const tagsText = content.text.trim();
            const tags = tagsText
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0 && tag.length <= 25)
                .slice(0, 8);

            console.log(`[Tag Generation] Generated tags: ${tags.join(', ')}`);
            return tags;
        }

        return generateFallbackTags(recipe);
    } catch (error) {
        console.error('[Tag Generation] Error:', error instanceof Error ? error.message : error);
        return generateFallbackTags(recipe);
    }
}

/**
 * Fallback tag generation without AI
 */
function generateFallbackTags(recipe: RecipeData): string[] {
    const tags: string[] = [];
    const nameLower = recipe.name.toLowerCase();
    const ingredientsLower = recipe.ingredients.map(i => i.toLowerCase()).join(' ');

    // Dish types
    if (nameLower.includes('suppe')) tags.push('Suppe');
    if (nameLower.includes('salat')) tags.push('Salat');
    if (nameLower.includes('auflauf')) tags.push('Auflauf');
    if (nameLower.includes('pasta') || nameLower.includes('nudel')) tags.push('Pasta');
    if (nameLower.includes('kuchen') || nameLower.includes('torte')) tags.push('Dessert');
    if (nameLower.includes('brot')) tags.push('Brot');

    // Protein types
    const hasMeat = ['fleisch', 'huhn', 'hähnchen', 'rind', 'schwein', 'hack'].some(
        m => ingredientsLower.includes(m)
    );
    const hasFish = ['fisch', 'lachs', 'thunfisch', 'garnelen'].some(
        f => ingredientsLower.includes(f)
    );

    if (hasMeat) tags.push('Fleisch');
    else if (hasFish) tags.push('Fisch');
    else if (!hasMeat && !hasFish) tags.push('Vegetarisch');

    // Default if no tags
    if (tags.length === 0) {
        tags.push('Hauptgericht');
    }

    return tags.slice(0, 6);
}
