'use client';

import {useEffect} from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({error, reset}: ErrorProps) {
    useEffect(() => {
        console.error('Page error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-2xl font-bold text-error mb-4">
                Etwas ist schiefgelaufen
            </h1>
            <p className="text-gray-600 mb-6">
                Ein unerwarteter Fehler ist aufgetreten.
            </p>
            <div className="flex gap-4">
                <button onClick={reset} className="btn btn-primary">
                    Erneut versuchen
                </button>
                <button
                    onClick={() => (window.location.href = '/')}
                    className="btn btn-outline"
                >
                    Zur Startseite
                </button>
            </div>
        </div>
    );
}
