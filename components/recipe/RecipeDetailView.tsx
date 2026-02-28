'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {QRCodeSVG} from 'qrcode.react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faQrcode, faTrash} from '@fortawesome/free-solid-svg-icons';
import {RecipeResponse} from '@/types/recipe';
import {generateBringUrl} from '@/lib/utils/generateBringUrl';
import PortionControl from '@/components/ui/PortionControl';
import ContentItem from '@/components/ui/ContentItem';
import RecipeInstructions from '@/components/ui/RecipeInstructions';
import Modal from '@/components/ui/Modal';
import DeleteDialog from '@/components/ui/DeleteDialog';

interface RecipeDetailViewProps {
    recipe: RecipeResponse;
}

export default function RecipeDetailView({recipe}: RecipeDetailViewProps) {
    const router = useRouter();
    const [portions, setPortions] = useState(recipe.recipeYield);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load saved portions from localStorage
    useEffect(() => {
        const savedPortions = localStorage.getItem(`recipe-portions-${recipe._id}`);
        if (savedPortions) {
            setPortions(parseInt(savedPortions, 10));
        }
    }, [recipe._id]);

    // Save portions to localStorage
    useEffect(() => {
        localStorage.setItem(`recipe-portions-${recipe._id}`, String(portions));
    }, [recipe._id, portions]);

    const portionMultiplier = portions / recipe.recipeYield;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const bringUrl = generateBringUrl({
        recipeId: recipe._id,
        baseUrl,
        baseQuantity: recipe.recipeYield,
        requestedQuantity: portions,
    });

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/recipes/${recipe._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/');
            } else {
                console.error('Failed to delete recipe');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    // Sort ingredients by position
    const sortedIngredients = [...recipe.ingredientListContent].sort(
        (a, b) => a.position - b.position
    );

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold text-text-dark">{recipe.name}</h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push(`/recipe/${recipe._id}/edit`)}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4"/>
                        <span className="hidden sm:inline">Bearbeiten</span>
                    </button>
                    <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="btn btn-error flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4"/>
                        <span className="hidden sm:inline">Löschen</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ingredients Column */}
                <div className="lg:col-span-1">
                    <div className="card p-6">
                        {/* Portion Control */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-header m-0">Portionen</h2>
                            <PortionControl
                                portions={portions}
                                onIncrease={() => setPortions((p) => p + 1)}
                                onDecrease={() => setPortions((p) => Math.max(1, p - 1))}
                            />
                        </div>

                        {/* Ingredients */}
                        <h2 className="section-header mt-6">Zutaten</h2>
                        <div className="space-y-1">
                            {sortedIngredients.map((content) => (
                                <ContentItem
                                    key={content.contentId}
                                    content={content}
                                    portionMultiplier={portionMultiplier}
                                />
                            ))}
                        </div>

                        {/* QR Code */}
                        <div className="mt-6 pt-6 border-t border-border-light">
                            <button
                                onClick={() => setShowQrModal(true)}
                                className="flex items-center gap-2 text-secondary hover:text-secondary-hover transition-colors"
                            >
                                <FontAwesomeIcon icon={faQrcode} className="w-5 h-5"/>
                                <span>QR-Code für Bring! anzeigen</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Instructions Column */}
                <div className="lg:col-span-2">
                    <div className="card p-6">
                        <h2 className="section-header">Zubereitung</h2>
                        <RecipeInstructions instructions={recipe.recipeInstructions}/>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            <Modal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                title="QR-Code für Bring!"
            >
                <div className="flex flex-col items-center gap-4">
                    <QRCodeSVG value={bringUrl} size={256}/>
                    <p className="text-sm text-gray-500 text-center">
                        Scanne diesen QR-Code mit der Bring! App, um die Zutaten zur
                        Einkaufsliste hinzuzufügen.
                    </p>
                    <p className="text-sm text-gray-400">
                        Portionen: {portions} (Original: {recipe.recipeYield})
                    </p>
                </div>
            </Modal>

            {/* Delete Dialog */}
            <DeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
