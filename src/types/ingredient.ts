export interface Ingredient {
    contentId?: string;
    ingredientName: string;
    unit?: string;
    amount?: string | number;
    position: number;
    dragDummy: string;
    contentType: ContentType.INGREDIENT;
}

export interface SectionCaption {
    contentId?: string;
    sectionName: string;
    position: number;
    contentType: ContentType.SECTION_CAPTION;
}

export type IngredientListContent = Ingredient | SectionCaption;

export enum ContentType {
    INGREDIENT = 'INGREDIENT',
    SECTION_CAPTION = 'SECTION_CAPTION',
}