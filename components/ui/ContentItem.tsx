import {IngredientListContent, isIngredient, isSectionCaption} from '@/types/ingredient';

interface ContentItemProps {
    content: IngredientListContent;
    portionMultiplier?: number;
}

export default function ContentItem({content, portionMultiplier = 1}: ContentItemProps) {
    if (isSectionCaption(content)) {
        return (
            <div className="section-caption">
                {content.sectionName}
            </div>
        );
    }

    if (isIngredient(content)) {
        const amount = content.amount
            ? typeof content.amount === 'number'
                ? Math.round(content.amount * portionMultiplier * 100) / 100
                : parseFloat(content.amount) * portionMultiplier
            : null;

        return (
            <div className="ingredient-item">
                {amount !== null && (
                    <span className="font-medium min-w-[4rem]">
            {amount} {content.unit || ''}
          </span>
                )}
                <span>{content.ingredientName}</span>
            </div>
        );
    }

    return null;
}
