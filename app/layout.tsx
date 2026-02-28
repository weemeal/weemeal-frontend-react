import type {Metadata} from 'next';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export const metadata: Metadata = {
    title: 'WeeMeal - Rezeptbuch',
    description: 'Dein digitales Rezeptbuch mit Einkaufslisten-Integration',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
        <body className="min-h-screen flex flex-col">
        <Navbar/>
        <main className="flex-1 container mx-auto px-4 py-6">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}
