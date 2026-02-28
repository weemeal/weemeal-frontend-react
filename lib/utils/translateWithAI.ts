import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

// Lazy load environment variable to support scripts that load dotenv after import
function getClient(): Anthropic | null {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return null;
    }
    if (!anthropicClient) {
        anthropicClient = new Anthropic({
            apiKey,
            // Explicitly use Anthropic API (override any system-level proxy settings)
            baseURL: 'https://api.anthropic.com',
        });
    }
    return anthropicClient;
}

/**
 * Translate German food/recipe terms to English using Claude AI
 * Optimized for image search queries
 */
export async function translateForImageSearch(germanText: string): Promise<string> {
    const client = getClient();

    if (!client) {
        console.log('[AI Translation] No ANTHROPIC_API_KEY configured, skipping translation');
        return germanText;
    }

    console.log(`[AI Translation] Translating: "${germanText}"`);

    try {
        const response = await client.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 100,
            messages: [
                {
                    role: 'user',
                    content: `Translate this German recipe/food name to English for an image search. Return ONLY the English translation, nothing else. Keep it short and focused on visual food terms.

German: "${germanText}"

English translation:`,
                },
            ],
        });

        const content = response.content[0];
        if (content.type === 'text') {
            const translation = content.text.trim().replace(/^["']|["']$/g, '');
            console.log(`[AI Translation] Success: "${germanText}" -> "${translation}"`);
            return translation;
        }

        console.log('[AI Translation] No text response, returning original');
        return germanText;
    } catch (error) {
        console.error('[AI Translation] Error:', error instanceof Error ? error.message : error);
        return germanText;
    }
}
