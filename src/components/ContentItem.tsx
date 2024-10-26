import React from 'react';

interface ContentItemProps {
    contentType: 'INGREDIENT' | 'SECTION_CAPTION';
    ingredientName?: string;
    amount?: string | number;
    unit?: string;
    sectionName?: string;
}

const ContentItem: React.FC<ContentItemProps> = ({
                                                     contentType,
                                                     ingredientName,
                                                     amount,
                                                     unit,
                                                     sectionName,
                                                 }) => {
    return (
        <div className="content-item">
            {contentType === 'INGREDIENT' ? (
                <div className="ingredient">
                    {ingredientName} {amount} {unit}
                </div>
            ) : (
                <div className="section-caption">
                    <strong>{sectionName}</strong>
                </div>
            )}
        </div>
    );
};

export default ContentItem;
