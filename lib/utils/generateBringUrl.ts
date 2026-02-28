const BRING_API_BASE = 'https://api.getbring.com/rest/bringrecipes/deeplink';

export interface GenerateBringUrlOptions {
    recipeId: string;
    baseUrl: string;
    baseQuantity: number;
    requestedQuantity: number;
}

export function generateBringUrl(options: GenerateBringUrlOptions): string {
    const {recipeId, baseUrl, baseQuantity, requestedQuantity} = options;

    // Build the recipe endpoint URL
    const recipeEndpoint = `${baseUrl}/api/recipes/bring/${recipeId}`;

    // Build the Bring deeplink URL
    const url = new URL(BRING_API_BASE);
    url.searchParams.set('url', recipeEndpoint);
    url.searchParams.set('source', 'web');
    url.searchParams.set('baseQuantity', String(baseQuantity));
    url.searchParams.set('requestedQuantity', String(requestedQuantity));

    return url.toString();
}

export function generateBringUrlFromEnv(
    recipeId: string,
    baseQuantity: number,
    requestedQuantity: number
): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return generateBringUrl({
        recipeId,
        baseUrl,
        baseQuantity,
        requestedQuantity,
    });
}

export default generateBringUrl;
