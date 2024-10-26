import React from 'react';
import {marked} from 'marked';
import styles from './RecipeInstructions.module.css';

interface RecipeInstructionsProps {
    instructions: string;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({instructions}) => {
    return (
        <div className={styles.recipeInstructions}>
            <h2>Zubereitung</h2>
            <div
                className={styles.instructionsContent}
                dangerouslySetInnerHTML={{__html: marked(instructions) as string}}
            />
        </div>
    );
};

export default RecipeInstructions;
