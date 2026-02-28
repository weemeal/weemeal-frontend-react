'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group"
                    >
                        <div
                            className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                            <Image
                                src="/logo192.png"
                                alt="WeeMeal Logo"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-text-dark tracking-tight">WeeMeal</span>
                            <span className="text-xs text-text-muted -mt-0.5 hidden sm:block">Dein Rezeptbuch</span>
                        </div>
                    </Link>

                </div>
            </div>
        </nav>
    );
}
