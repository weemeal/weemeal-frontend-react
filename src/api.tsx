const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

export const fetchRecipes = async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch recipes');
    }
    return response.json();
};

export const fetchRecipeById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch recipe with id: ${id}`);
    }
    return response.json();
};

export const createRecipe = async (recipe: any) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    });
    if (!response.ok) {
        throw new Error('Failed to create recipe');
    }
    return response.json();
};

export const updateRecipe = async (recipe: any) => {
    const response = await fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    });
    if (!response.ok) {
        throw new Error('Failed to update recipe');
    }
    return response.json();
};

export const deleteRecipe = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete recipe with id: ${id}`);
    }
    return response.json();
};
