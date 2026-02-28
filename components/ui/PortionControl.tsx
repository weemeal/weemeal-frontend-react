'use client';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';

interface PortionControlProps {
    portions: number;
    onIncrease: () => void;
    onDecrease: () => void;
    minPortions?: number;
    maxPortions?: number;
}

export default function PortionControl({
                                           portions,
                                           onIncrease,
                                           onDecrease,
                                           minPortions = 1,
                                           maxPortions = 100,
                                       }: PortionControlProps) {
    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={onDecrease}
                disabled={portions <= minPortions}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-white hover:bg-secondary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Portionen verringern"
            >
                <FontAwesomeIcon icon={faMinus} className="w-3 h-3"/>
            </button>

            <span className="text-lg font-semibold min-w-[3ch] text-center">
        {portions}
      </span>

            <button
                type="button"
                onClick={onIncrease}
                disabled={portions >= maxPortions}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-white hover:bg-secondary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Portionen erhöhen"
            >
                <FontAwesomeIcon icon={faPlus} className="w-3 h-3"/>
            </button>
        </div>
    );
}
