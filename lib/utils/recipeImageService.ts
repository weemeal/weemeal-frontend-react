// Recipe Image Service
// Uses Unsplash API for high-quality food illustrations/photos
// Falls back to placeholder images if no API key is configured

import {translateForImageSearch} from './translateWithAI';

// Lazy load environment variable to support scripts that load dotenv after import
function getUnsplashKey(): string | undefined {
    return process.env.UNSPLASH_ACCESS_KEY;
}

interface UnsplashPhoto {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string;
    user: {
        name: string;
        links: {
            html: string;
        };
    };
}

interface ImageResult {
    url: string;
    attribution?: string;
    source: 'unsplash' | 'placeholder';
}

// Comprehensive German to English food translations
// Sorted by length (longest first) for compound word matching
const GERMAN_FOOD_TRANSLATIONS: [string, string][] = [
    // Compound dishes (longer terms first)
    ['kartoffelauflauf', 'potato casserole'],
    ['nudelauflauf', 'pasta casserole baked'],
    ['gemüseauflauf', 'vegetable casserole'],
    ['kartoffelsalat', 'potato salad'],
    ['kartoffelpuffer', 'potato fritters pancakes'],
    ['kartoffelsuppe', 'potato soup'],
    ['kartoffelbrei', 'mashed potatoes'],
    ['bratkartoffeln', 'fried potatoes'],
    ['pellkartoffeln', 'boiled potatoes'],
    ['schwarzwälder', 'black forest'],
    ['schweinebraten', 'roast pork'],
    ['rinderbraten', 'roast beef'],
    ['sauerbraten', 'marinated roast beef'],
    ['schweinefleisch', 'pork meat'],
    ['rindfleisch', 'beef meat'],
    ['hackfleisch', 'ground meat minced'],
    ['hühnerfleisch', 'chicken meat'],
    ['putenfleisch', 'turkey meat'],
    ['lammfleisch', 'lamb meat'],
    ['fleischbällchen', 'meatballs'],
    ['frikadellen', 'meatballs german'],
    ['königsberger', 'koenigsberg meatballs'],
    ['käsekuchen', 'cheesecake'],
    ['apfelkuchen', 'apple cake pie'],
    ['pflaumenkuchen', 'plum cake'],
    ['streuselkuchen', 'crumble cake'],
    ['bienenstich', 'bee sting cake'],
    ['apfelstrudel', 'apple strudel pastry'],
    ['kaiserschmarrn', 'shredded pancake austrian'],
    ['pfannkuchen', 'pancakes german'],
    ['reibekuchen', 'potato pancakes'],
    ['milchreis', 'rice pudding'],
    ['grießbrei', 'semolina pudding'],
    ['leberkäse', 'meatloaf bavarian'],
    ['weißwurst', 'white sausage bavarian'],
    ['currywurst', 'curry sausage'],
    ['bratwurst', 'grilled sausage'],
    ['bockwurst', 'boiled sausage'],
    ['knackwurst', 'crackling sausage'],
    ['blutwurst', 'blood sausage'],
    ['leberwurst', 'liver sausage pate'],
    ['sauerkraut', 'sauerkraut fermented cabbage'],
    ['rotkohl', 'red cabbage'],
    ['grünkohl', 'kale green'],
    ['rosenkohl', 'brussels sprouts'],
    ['blumenkohl', 'cauliflower'],
    ['weißkohl', 'white cabbage'],
    ['wirsing', 'savoy cabbage'],
    ['kohlrabi', 'kohlrabi'],
    ['spargel', 'asparagus'],
    ['erbsensuppe', 'pea soup'],
    ['linsensuppe', 'lentil soup'],
    ['gulaschsuppe', 'goulash soup'],
    ['hühnersuppe', 'chicken soup'],
    ['tomatensuppe', 'tomato soup'],
    ['zwiebelsuppe', 'onion soup'],
    ['semmelknödel', 'bread dumplings'],
    ['kartoffelknödel', 'potato dumplings'],
    ['spätzle', 'spaetzle german egg noodles'],
    ['maultaschen', 'german ravioli dumplings'],
    ['schupfnudeln', 'finger shaped potato noodles'],
    // Simple dishes
    ['auflauf', 'casserole baked'],
    ['eintopf', 'stew one pot'],
    ['braten', 'roast'],
    ['schnitzel', 'schnitzel breaded cutlet'],
    ['gulasch', 'goulash stew'],
    ['roulade', 'roulade rolled meat'],
    ['frikadelle', 'meatball'],
    ['bulette', 'meatball'],
    ['knödel', 'dumpling'],
    ['kloß', 'dumpling'],
    ['klöße', 'dumplings'],
    // Proteins
    ['hähnchen', 'chicken'],
    ['hühnchen', 'chicken'],
    ['huhn', 'chicken'],
    ['pute', 'turkey'],
    ['ente', 'duck'],
    ['gans', 'goose'],
    ['rind', 'beef'],
    ['schwein', 'pork'],
    ['lamm', 'lamb'],
    ['kalb', 'veal'],
    ['wild', 'game venison'],
    ['hirsch', 'deer venison'],
    ['hase', 'rabbit'],
    ['kaninchen', 'rabbit'],
    ['lachs', 'salmon'],
    ['forelle', 'trout'],
    ['kabeljau', 'cod'],
    ['thunfisch', 'tuna'],
    ['hering', 'herring'],
    ['makrele', 'mackerel'],
    ['garnelen', 'shrimp prawns'],
    ['krabben', 'crab shrimp'],
    ['muscheln', 'mussels'],
    ['tintenfisch', 'squid calamari'],
    ['fisch', 'fish'],
    ['fleisch', 'meat'],
    ['wurst', 'sausage'],
    ['schinken', 'ham'],
    ['speck', 'bacon'],
    ['ei', 'egg'],
    ['eier', 'eggs'],
    // Vegetables
    ['kartoffel', 'potato'],
    ['kartoffeln', 'potatoes'],
    ['tomate', 'tomato'],
    ['tomaten', 'tomatoes'],
    ['zwiebel', 'onion'],
    ['zwiebeln', 'onions'],
    ['knoblauch', 'garlic'],
    ['paprika', 'bell pepper'],
    ['gurke', 'cucumber'],
    ['karotte', 'carrot'],
    ['möhre', 'carrot'],
    ['möhren', 'carrots'],
    ['zucchini', 'zucchini'],
    ['aubergine', 'eggplant'],
    ['brokkoli', 'broccoli'],
    ['spinat', 'spinach'],
    ['champignon', 'mushroom'],
    ['pilz', 'mushroom'],
    ['pilze', 'mushrooms'],
    ['bohnen', 'beans'],
    ['erbsen', 'peas'],
    ['linsen', 'lentils'],
    ['mais', 'corn'],
    ['kürbis', 'pumpkin squash'],
    ['sellerie', 'celery'],
    ['lauch', 'leek'],
    ['porree', 'leek'],
    ['fenchel', 'fennel'],
    ['rote bete', 'beetroot'],
    ['radieschen', 'radish'],
    ['rettich', 'radish daikon'],
    ['gemüse', 'vegetables'],
    ['salat', 'salad lettuce'],
    // Carbs & Grains
    ['nudeln', 'pasta noodles'],
    ['spaghetti', 'spaghetti'],
    ['reis', 'rice'],
    ['brot', 'bread'],
    ['brötchen', 'bread roll'],
    ['semmel', 'bread roll'],
    ['mehl', 'flour'],
    ['grieß', 'semolina'],
    ['haferflocken', 'oatmeal oats'],
    // Dairy
    ['käse', 'cheese'],
    ['milch', 'milk'],
    ['sahne', 'cream'],
    ['butter', 'butter'],
    ['joghurt', 'yogurt'],
    ['quark', 'quark cottage cheese'],
    // Fruits
    ['apfel', 'apple'],
    ['birne', 'pear'],
    ['orange', 'orange'],
    ['zitrone', 'lemon'],
    ['erdbeere', 'strawberry'],
    ['himbeere', 'raspberry'],
    ['heidelbeere', 'blueberry'],
    ['kirsche', 'cherry'],
    ['pflaume', 'plum'],
    ['traube', 'grape'],
    ['banane', 'banana'],
    ['obst', 'fruit'],
    // Cooking methods & descriptions
    ['gebraten', 'fried pan-fried'],
    ['gegrillt', 'grilled bbq'],
    ['gebacken', 'baked oven'],
    ['gekocht', 'boiled cooked'],
    ['gedünstet', 'steamed'],
    ['geschmort', 'braised stewed'],
    ['überbacken', 'gratinated baked cheese'],
    ['gefüllt', 'stuffed filled'],
    ['paniert', 'breaded'],
    ['mariniert', 'marinated'],
    ['geräuchert', 'smoked'],
    ['frisch', 'fresh'],
    ['hausgemacht', 'homemade'],
    ['klassisch', 'classic traditional'],
    ['cremig', 'creamy'],
    ['knusprig', 'crispy crunchy'],
    ['würzig', 'spicy seasoned'],
    ['süß', 'sweet'],
    ['sauer', 'sour'],
    ['scharf', 'spicy hot'],
    // Sauces & Condiments
    ['soße', 'sauce gravy'],
    ['sauce', 'sauce'],
    ['bratensoße', 'gravy'],
    ['tomatensoße', 'tomato sauce'],
    ['rahmsoße', 'cream sauce'],
    ['senf', 'mustard'],
    ['ketchup', 'ketchup'],
    ['mayonnaise', 'mayonnaise'],
    ['essig', 'vinegar'],
    ['öl', 'oil'],
    // Meals
    ['suppe', 'soup'],
    ['vorspeise', 'appetizer starter'],
    ['hauptgericht', 'main course'],
    ['beilage', 'side dish'],
    ['nachtisch', 'dessert'],
    ['dessert', 'dessert'],
    ['kuchen', 'cake'],
    ['torte', 'cake torte'],
    ['gebäck', 'pastry'],
    ['keks', 'cookie biscuit'],
    ['plätzchen', 'cookies'],
    // Misc
    ['mit', 'with'],
    ['und', 'and'],
    ['oder', 'or'],
    ['nach', 'style'],
    ['art', 'style'],
    ['oma', 'grandma traditional'],
    ['mama', 'mom homestyle'],
];

/**
 * Generate a search query from recipe name using AI translation
 * Falls back to dictionary if AI is not available
 */
async function generateSearchQuery(recipeName: string): Promise<string> {
    // First try AI translation
    const aiTranslation = await translateForImageSearch(recipeName);

    // If AI returned something different, use it
    if (aiTranslation && aiTranslation.toLowerCase() !== recipeName.toLowerCase()) {
        return `${aiTranslation} food delicious`;
    }

    // Fallback to dictionary-based translation
    let text = recipeName
        .toLowerCase()
        .replace(/[^a-zäöüß\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Replace German terms with English (longest matches first)
    for (const [german, english] of GERMAN_FOOD_TRANSLATIONS) {
        const regex = new RegExp(german, 'gi');
        text = text.replace(regex, english);
    }

    // Clean up extra spaces
    text = text.replace(/\s+/g, ' ').trim();

    // Add food context for better results
    return `${text} food delicious`;
}

/**
 * Fetch image from Unsplash API
 */
async function fetchFromUnsplash(query: string): Promise<ImageResult | null> {
    const unsplashKey = getUnsplashKey();
    if (!unsplashKey) {
        console.log('No UNSPLASH_ACCESS_KEY configured, using placeholder');
        return null;
    }

    try {
        console.log('Searching Unsplash for:', query);

        const searchUrl = new URL('https://api.unsplash.com/search/photos');
        searchUrl.searchParams.set('query', query);
        searchUrl.searchParams.set('per_page', '5'); // Get more results to choose from
        searchUrl.searchParams.set('orientation', 'landscape');

        const response = await fetch(searchUrl.toString(), {
            headers: {
                Authorization: `Client-ID ${unsplashKey}`,
            },
        });

        if (!response.ok) {
            console.error('Unsplash API error:', response.status, await response.text());
            return null;
        }

        const data = await response.json();
        console.log('Unsplash results:', data.results?.length || 0);

        if (data.results && data.results.length > 0) {
            // Pick a random result from the first 5 for variety
            const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5));
            const photo: UnsplashPhoto = data.results[randomIndex];
            return {
                url: photo.urls.regular,
                attribution: `Photo by ${photo.user.name} on Unsplash`,
                source: 'unsplash',
            };
        }

        console.log('No Unsplash results found for:', query);
        return null;
    } catch (error) {
        console.error('Error fetching from Unsplash:', error);
        return null;
    }
}

/**
 * Generate a placeholder illustration as SVG data URL
 */
function generatePlaceholderImage(recipeName: string): ImageResult {
    // Use a food-themed color palette
    const colors = [
        {bg: '#FEF3C7', accent: '#F59E0B'}, // Amber
        {bg: '#DCFCE7', accent: '#22C55E'}, // Green
        {bg: '#FEE2E2', accent: '#EF4444'}, // Red
        {bg: '#E0E7FF', accent: '#6366F1'}, // Indigo
        {bg: '#FCE7F3', accent: '#EC4899'}, // Pink
    ];
    const colorIndex = recipeName.length % colors.length;
    const {bg, accent} = colors[colorIndex];

    const displayText = recipeName.substring(0, 25);

    // Generate SVG as data URL
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="${bg}"/>
        <circle cx="400" cy="250" r="100" fill="${accent}" opacity="0.2"/>
        <circle cx="400" cy="250" r="70" fill="${accent}" opacity="0.3"/>
        <text x="400" y="265" text-anchor="middle" font-family="Arial, sans-serif" font-size="50" fill="${accent}">🍽️</text>
        <text x="400" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#374151" font-weight="600">${displayText}</text>
    </svg>`;

    const url = `data:image/svg+xml,${encodeURIComponent(svg)}`;

    return {
        url,
        source: 'placeholder',
    };
}

/**
 * Generate SVG placeholder for recipe
 */
export function generateSvgPlaceholder(recipeName: string): string {
    // Color palette for food illustrations
    const colors = [
        {bg: '#FEF3C7', accent: '#F59E0B'}, // Amber
        {bg: '#DCFCE7', accent: '#22C55E'}, // Green
        {bg: '#FEE2E2', accent: '#EF4444'}, // Red
        {bg: '#E0E7FF', accent: '#6366F1'}, // Indigo
        {bg: '#FCE7F3', accent: '#EC4899'}, // Pink
    ];

    const colorIndex = recipeName.length % colors.length;
    const {bg, accent} = colors[colorIndex];

    // Simple food icon SVG
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="${bg}"/>
  <circle cx="400" cy="280" r="150" fill="${accent}" opacity="0.2"/>
  <circle cx="400" cy="280" r="120" fill="${accent}" opacity="0.3"/>
  <circle cx="400" cy="280" r="90" fill="${accent}" opacity="0.4"/>
  <!-- Fork icon -->
  <g transform="translate(340, 200)" fill="${accent}">
    <rect x="20" y="0" width="8" height="100" rx="4"/>
    <rect x="0" y="0" width="8" height="50" rx="4"/>
    <rect x="40" y="0" width="8" height="50" rx="4"/>
    <rect x="48" y="0" width="8" height="100" rx="4"/>
  </g>
  <!-- Knife icon -->
  <g transform="translate(400, 200)" fill="${accent}">
    <path d="M10 0 L30 0 L30 80 L20 100 L10 80 Z"/>
  </g>
</svg>`.trim();

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get image for a recipe
 * Tries Unsplash first, falls back to placeholder
 */
export async function getRecipeImage(recipeName: string): Promise<ImageResult> {
    const query = await generateSearchQuery(recipeName);

    // Try Unsplash first
    const unsplashResult = await fetchFromUnsplash(query);
    if (unsplashResult) {
        return unsplashResult;
    }

    // Fall back to placeholder
    return generatePlaceholderImage(recipeName);
}

/**
 * Get image URL for recipe (simple version)
 * Returns URL string only
 */
export async function getRecipeImageUrl(recipeName: string): Promise<string> {
    const result = await getRecipeImage(recipeName);
    return result.url;
}
