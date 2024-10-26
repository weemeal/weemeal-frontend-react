import React from 'react';
import {SectionCaption} from '../../../../types/ingredient';
import './SectionInput.css';

interface SectionInputProps {
    content: SectionCaption;
    index: number;
    handleContentChange: (index: number, field: string, value: string) => void;
    isSubmitting: boolean;
}

const SectionInput: React.FC<SectionInputProps> = ({content, index, handleContentChange, isSubmitting}) => (
    <div className="section-input">
        <input
            type="text"
            value={content.sectionName}
            name="sectionName"
            placeholder="Sektion"
            onChange={(e) => handleContentChange(index, 'sectionName', e.target.value)}
            required
            disabled={isSubmitting}
        />
    </div>
);

export default SectionInput;