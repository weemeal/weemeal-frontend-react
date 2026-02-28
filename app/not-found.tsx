import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-4xl font-bold text-text-dark mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-6">
                Die Seite wurde nicht gefunden.
            </p>
            <Link href="/" className="btn btn-primary">
                Zurück zur Startseite
            </Link>
        </div>
    );
}
