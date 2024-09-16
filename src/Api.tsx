const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

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