import {Recipe} from "./types/recipe";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

export const fetchRecipes = async (): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/api/recipes/`);
    if (!response.ok) {
        throw new Error('Failed to fetch recipes');
    }
    const data = await response.json();

    return data.map((recipe: Recipe) => ({
        ...recipe,

        ingredientListContent: recipe.ingredientListContent.map((content: any) => ({
            ...content,
            contentType: content.contentType as 'INGREDIENT' | 'SECTION_CAPTION'
        }))
    }));
};

export const fetchRecipeById = async (id: string): Promise<Recipe> => {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch recipe with id: ${id}`);
    }
    const data = await response.json();

    // Optional: Mapping-Funktion falls Backend-Rohdaten kommen
    return {
        ...data,
        ingredientListContent: data.ingredientListContent.map((content: any) => ({
            ...content,
            contentType: content.contentType as 'INGREDIENT' | 'SECTION_CAPTION'
        }))
    };
};

export const saveRecipe = async (recipe: Recipe): Promise<Recipe> => {
    const response = await fetch(`${API_BASE_URL}/api/recipes/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    });
    if (!response.ok) {
        throw new Error('Failed to save recipe');
    }
    return response.json();
};

export const deleteRecipe = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete recipe with id: ${id}`);
    }

    if (response.status !== 204) {
        return response.json();
    }
};
