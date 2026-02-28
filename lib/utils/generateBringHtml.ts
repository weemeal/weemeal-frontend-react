import {Ingredient, IngredientListContent, Recipe} from '@/types/recipe';

function isIngredient(content: IngredientListContent): content is Ingredient {
    return content.contentType === 'INGREDIENT';
}

function formatIngredient(ingredient: Ingredient): string {
    const parts: string[] = [];

    if (ingredient.amount !== undefined && ingredient.amount !== null) {
        parts.push(String(ingredient.amount));
    }

    if (ingredient.unit) {
        parts.push(ingredient.unit);
    }

    parts.push(ingredient.ingredientName);

    return parts.join(' ');
}

export function generateBringHtml(recipe: Recipe): string {
    const ingredients = recipe.ingredientListContent
        .filter(isIngredient)
        .sort((a, b) => a.position - b.position);

    const ingredientStrings = ingredients.map(formatIngredient);

    const schemaOrgRecipe = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: recipe.name,
        recipeYield: String(recipe.recipeYield),
        recipeIngredient: ingredientStrings,
        recipeInstructions: recipe.recipeInstructions,
    };

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(recipe.name)}</title>
    <script type="application/ld+json">
${JSON.stringify(schemaOrgRecipe, null, 2)}
    </script>
</head>
<body>
    <h1>${escapeHtml(recipe.name)}</h1>
    <p>Portionen: ${recipe.recipeYield}</p>
    <h2>Zutaten</h2>
    <ul>
${ingredientStrings.map((i) => `        <li>${escapeHtml(i)}</li>`).join('\n')}
    </ul>
    <h2>Zubereitung</h2>
    <div>${escapeHtml(recipe.recipeInstructions)}</div>
</body>
</html>`;

    return html;
}

function escapeHtml(text: string): string {
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

export default generateBringHtml;
