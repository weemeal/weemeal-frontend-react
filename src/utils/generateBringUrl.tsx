const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

export const generateBringUrl = (recipe: any, requestedQuantity: number = recipe.recipeYield) => {
    let bringUrl = 'https://api.getbring.com/rest/bringrecipes/deeplink'
    let backendUrl = `${API_BASE_URL}/api/recipes/bring/${recipe.recipeId}`
    let source = "web"
    let baseQuantity = recipe.recipeYield

    return `${bringUrl}?url=${backendUrl}&source=${source}&baseQuantity=${baseQuantity}&requestedQuantity=${requestedQuantity}`
}