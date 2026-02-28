export type ContentType = 'INGREDIENT' | 'SECTION_CAPTION';

export interface Ingredient {
    contentId?: string;
    ingredientName: string;
    unit?: string;
    amount?: string | number;
    position: number;
    contentType: 'INGREDIENT';
}

export interface SectionCaption {
    contentId?: string;
    sectionName: string;
    position: number;
    contentType: 'SECTION_CAPTION';
}

export type IngredientListContent = Ingredient | SectionCaption;

export function isIngredient(content: IngredientListContent): content is Ingredient {
    return content.contentType === 'INGREDIENT';
}

export function isSectionCaption(content: IngredientListContent): content is SectionCaption {
    return content.contentType === 'SECTION_CAPTION';
}
