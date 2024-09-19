const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY as string; // Spoonacular API Key

export const fetchRecipes = async () => {
    const response = await fetch(`${API_BASE_URL}/api/recipes/`);
    if (!response.ok) {
        throw new Error('Failed to fetch recipes');
    }
    return response.json();
};

export const fetchRecipeById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch recipe with id: ${id}`);
    }
    return response.json();
};

export const saveRecipe = async (recipe: any) => {
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

// Fetch a recipe image from Spoonacular
export const fetchImageFromSpoonacular = async (recipeName: string) => {
    const response = await fetch(
        `https://api.spoonacular.com/food/menuItems/search?query=${recipeName}&apiKey=${SPOONACULAR_API_KEY}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch image from Spoonacular with recipe: ${recipeName}`);
    }
    const data = await response.json();
    return data.menuItems[0]?.image || null; // Return the first image URL if available
};


export const generateBringUrl = (recipe: any) => {
    let bringUrl = 'https://api.getbring.com/rest/bringrecipes/deeplink'
    let backendUrl = `${API_BASE_URL}/api/recipes/bring/${recipe.recipeId}`
    let source = "web"
    let baseQuantity = recipe.recipeYield
    let requestedQuantity = recipe.recipeYield

    return `${bringUrl}?url=${backendUrl}&source=${source}&baseQuantity=${baseQuantity}&requestedQuantity=${requestedQuantity}`
}


export const fetchRecipeByIdWithBringResponse = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/recipes/bring/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch recipe with id: ${id}`);
    }
    return response.json();
};