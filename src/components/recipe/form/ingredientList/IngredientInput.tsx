import React from 'react';
import {Ingredient} from '../../../../types/ingredient';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import './IngredientInput.css';

interface IngredientInputProps {
    content: Ingredient;
    index: number;
    handleContentChange: (index: number, field: string, value: string) => void;
    removeContent: (index: number) => void;
    isSubmitting: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({
                                                             content,
                                                             index,
                                                             handleContentChange,
                                                             removeContent,
                                                             isSubmitting
                                                         }) => (
    <div className="ingredient-input">
        <input
            type="text"
            value={content.ingredientName}
            name="ingredientName"
            placeholder="Name"
            onChange={(e) => handleContentChange(index, 'ingredientName', e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="new-password"
        />
        <input
            type="number"
            className="ingredient-amount-input"
            value={content.amount !== undefined ? String(content.amount) : ""}
            name="amount"
            placeholder="Menge (optional)"
            onChange={(e) => handleContentChange(index, 'amount', e.target.value)}
            disabled={isSubmitting}
        />
        <input
            type="text"
            value={content.unit || ''}
            name="unit"
            placeholder="Einheit (optional)"
            onChange={(e) => handleContentChange(index, 'unit', e.target.value)}
            disabled={isSubmitting}
        />
        <button
            type="button"
            className="delete-ingredient-button"
            onClick={() => removeContent(index)}
            disabled={isSubmitting}
        >
            <FontAwesomeIcon icon={faTrash}/>
        </button>
    </div>
);

export default IngredientInput;