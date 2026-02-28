import {marked} from 'marked';

interface RecipeInstructionsProps {
    instructions: string;
}

export default function RecipeInstructions({instructions}: RecipeInstructionsProps) {
    if (!instructions || instructions.trim() === '') {
        return (
            <p className="text-gray-500 italic">Keine Zubereitungsanleitung vorhanden.</p>
        );
    }

    // Parse markdown to HTML
    const htmlContent = marked.parse(instructions, {
        gfm: true,
        breaks: true,
    });

    return (
        <div
            className="recipe-instructions"
            dangerouslySetInnerHTML={{__html: htmlContent}}
        />
    );
}
