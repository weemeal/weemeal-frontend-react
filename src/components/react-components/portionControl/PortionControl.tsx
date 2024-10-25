import React from 'react';
import styles from './PortionControl.module.css';
import {PortionChange} from "../../../types/portion-change";

interface PortionControlProps {
    portion: number;
    changePortion: (type: PortionChange) => void;
}

const PortionControl: React.FC<PortionControlProps> = ({portion, changePortion}) => {
    return (
        <div className={styles.recipePortions}>
            <strong>Portionen:</strong>
            <button type="button" className={styles.portionButton}
                    onClick={() => changePortion(PortionChange.DECREASE)}>-
            </button>
            <span>{portion}</span>
            <button type="button" className={styles.portionButton}
                    onClick={() => changePortion(PortionChange.INCREASE)}>+
            </button>
        </div>
    );
};

export default PortionControl;
