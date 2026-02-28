'use client';

import {useCallback, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';

interface RecipeSearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function RecipeSearchBar({
                                            onSearch,
                                            placeholder = 'Suche Rezepte...',
                                        }: RecipeSearchBarProps) {
    const [query, setQuery] = useState('');

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setQuery(value);
            onSearch(value);
        },
        [onSearch]
    );

    const handleClear = useCallback(() => {
        setQuery('');
        onSearch('');
    }, [onSearch]);

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-gray-400"/>
            </div>

            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="input pl-10 pr-10"
            />

            {query && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4"/>
                </button>
            )}
        </div>
    );
}
