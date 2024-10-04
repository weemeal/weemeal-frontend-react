export interface Ingredient {
    ingredientId?: string;
    ingredientName: string;
    unit?: string;
    amount?: string | number;
    position: number;
    dragDummy: string;
}