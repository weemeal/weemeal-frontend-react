export interface Ingredient {
    contentId?: string;
    ingredientName: string;
    unit?: string;
    amount?: string | number;
    position: number;
    dragDummy: string;
    contentType: 'INGREDIENT';
}

export interface SectionCaption {
    contentId?: string;
    sectionName: string;
    position: number;
    contentType: 'SECTION_CAPTION';
}

export type IngredientListContent = Ingredient | SectionCaption;