'use client';

import Link from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUtensils} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-primary text-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Recipe Book link */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        <FontAwesomeIcon icon={faUtensils} className="w-5 h-5"/>
                        <span>Rezeptbuch</span>
                    </Link>

                    {/* Right side - Logo/Brand */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">WeeMeal</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
