import {describe, expect, it} from 'vitest';
import {generateBringHtml} from '@/lib/utils/generateBringHtml';
import {Recipe} from '@/types/recipe';

describe('generateBringHtml', () => {
    it('should generate valid Schema.org HTML', () => {
        const recipe: Recipe = {
            _id: '123',
            name: 'Test Recipe',
            recipeYield: 4,
            recipeInstructions: 'Step 1, Step 2',
            ingredientListContent: [
                {
                    contentId: 'i1',
                    contentType: 'INGREDIENT',
                    position: 0,
                    ingredientName: 'Mehl',
                    amount: 500,
                    unit: 'g',
                },
                {
                    contentId: 's1',
                    contentType: 'SECTION_CAPTION',
                    position: 1,
                    sectionName: 'Sauce',
                },
                {
                    contentId: 'i2',
                    contentType: 'INGREDIENT',
                    position: 2,
                    ingredientName: 'Tomaten',
                    amount: 2,
                    unit: 'Stück',
                },
            ],
        };

        const html = generateBringHtml(recipe);

        expect(html).toContain('https://schema.org');
        expect(html).toContain('"@type": "Recipe"');
        expect(html).toContain('Test Recipe');
        expect(html).toContain('500 g Mehl');
        expect(html).toContain('2 Stück Tomaten');
        // Sections should be filtered out from ingredients (only in recipeIngredient array)
        expect(html).not.toContain('"Sauce"');
    });

    it('should handle empty ingredient list', () => {
        const recipe: Recipe = {
            _id: '123',
            name: 'Empty Recipe',
            recipeYield: 1,
            recipeInstructions: 'Nothing',
            ingredientListContent: [],
        };

        const html = generateBringHtml(recipe);
        expect(html).toContain('Empty Recipe');
        expect(html).toContain('"recipeIngredient": []');
    });

    it('should escape HTML entities in recipe name in title and body', () => {
        const recipe: Recipe = {
            _id: '123',
            name: 'Recipe <script>alert("xss")</script>',
            recipeYield: 1,
            recipeInstructions: '',
            ingredientListContent: [],
        };

        const html = generateBringHtml(recipe);
        // Check that the title tag has escaped content
        expect(html).toContain('<title>Recipe &lt;script&gt;');
        // Check that the h1 tag has escaped content
        expect(html).toContain('<h1>Recipe &lt;script&gt;');
        // The JSON-LD script tag is allowed (for schema.org)
        expect(html).toContain('application/ld+json');
    });

    it('should handle ingredients without amount', () => {
        const recipe: Recipe = {
            _id: '123',
            name: 'Test',
            recipeYield: 2,
            recipeInstructions: '',
            ingredientListContent: [
                {
                    contentId: 'i1',
                    contentType: 'INGREDIENT',
                    position: 0,
                    ingredientName: 'Salz',
                },
            ],
        };

        const html = generateBringHtml(recipe);
        expect(html).toContain('Salz');
    });

    it('should handle ingredients without unit', () => {
        const recipe: Recipe = {
            _id: '123',
            name: 'Test',
            recipeYield: 2,
            recipeInstructions: '',
            ingredientListContent: [
                {
                    contentId: 'i1',
                    contentType: 'INGREDIENT',
                    position: 0,
                    ingredientName: 'Eier',
                    amount: 3,
                },
            ],
        };

        const html = generateBringHtml(recipe);
        expect(html).toContain('3 Eier');
    });

    it('should sort ingredients by position', () => {
        const recipe: Recipe = {
            _id: '123',
            name: 'Test',
            recipeYield: 2,
            recipeInstructions: '',
            ingredientListContent: [
                {
                    contentId: 'i2',
                    contentType: 'INGREDIENT',
                    position: 2,
                    ingredientName: 'Zucker',
                    amount: 100,
                    unit: 'g',
                },
                {
                    contentId: 'i1',
                    contentType: 'INGREDIENT',
                    position: 0,
                    ingredientName: 'Mehl',
                    amount: 200,
                    unit: 'g',
                },
            ],
        };

        const html = generateBringHtml(recipe);
        const mehlIndex = html.indexOf('Mehl');
        const zuckerIndex = html.indexOf('Zucker');
        expect(mehlIndex).toBeLessThan(zuckerIndex);
    });
});
