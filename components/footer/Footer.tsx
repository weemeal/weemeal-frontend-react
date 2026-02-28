import Link from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import type {IconProp} from '@fortawesome/fontawesome-svg-core';

export default function Footer() {
    const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

    return (
        <footer className="bg-primary text-white py-4 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    {/* Version */}
                    <div className="text-sm opacity-80">
                        Version {version}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4 text-sm">
                        <Link
                            href="https://github.com/weemeal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                            <FontAwesomeIcon icon={faGithub as IconProp} className="w-4 h-4"/>
                            <span>GitHub</span>
                        </Link>
                        <Link
                            href="https://github.com/weemeal/weemeal-frontend-react/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity"
                        >
                            Feedback
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
