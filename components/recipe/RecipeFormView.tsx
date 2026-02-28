'use client';

import {useCallback, useState} from 'react';
import {useRouter} from 'next/navigation';
import {DragDropContext, Draggable, Droppable, DropResult,} from '@hello-pangea/dnd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGripVertical, faPlus, faSave, faTrash,} from '@fortawesome/free-solid-svg-icons';
import {v4 as uuidv4} from 'uuid';
import {IngredientListContent, RecipeResponse} from '@/types/recipe';
import PortionControl from '@/components/ui/PortionControl';

interface RecipeFormViewProps {
    recipe?: RecipeResponse;
    isEditing?: boolean;
}

export default function RecipeFormView({
                                           recipe,
                                           isEditing = false,
                                       }: RecipeFormViewProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [name, setName] = useState(recipe?.name || '');
    const [recipeYield, setRecipeYield] = useState(recipe?.recipeYield || 4);
    const [recipeInstructions, setRecipeInstructions] = useState(
        recipe?.recipeInstructions || ''
    );
    const [ingredientListContent, setIngredientListContent] = useState<
        IngredientListContent[]
    >(recipe?.ingredientListContent || []);

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAddIngredient = useCallback(() => {
        const newIngredient: IngredientListContent = {
            contentId: uuidv4(),
            contentType: 'INGREDIENT',
            position: ingredientListContent.length,
            ingredientName: '',
            amount: undefined,
            unit: '',
        };
        setIngredientListContent((prev) => [...prev, newIngredient]);
    }, [ingredientListContent.length]);

    const handleAddSection = useCallback(() => {
        const newSection: IngredientListContent = {
            contentId: uuidv4(),
            contentType: 'SECTION_CAPTION',
            position: ingredientListContent.length,
            sectionName: '',
        };
        setIngredientListContent((prev) => [...prev, newSection]);
    }, [ingredientListContent.length]);

    const handleRemoveContent = useCallback((contentId: string) => {
        setIngredientListContent((prev) =>
            prev
                .filter((c) => c.contentId !== contentId)
                .map((c, idx) => ({...c, position: idx}))
        );
    }, []);

    const handleContentChange = useCallback(
        (contentId: string, field: string, value: string | number) => {
            setIngredientListContent((prev) =>
                prev.map((c) =>
                    c.contentId === contentId ? {...c, [field]: value} : c
                )
            );
        },
        []
    );

    const handleDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        if (sourceIndex === destIndex) return;

        setIngredientListContent((prev) => {
            const items = [...prev];
            const [removed] = items.splice(sourceIndex, 1);
            items.splice(destIndex, 0, removed);
            return items.map((item, idx) => ({...item, position: idx}));
        });
    }, []);

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Rezeptname ist erforderlich';
        }

        if (recipeYield < 1) {
            newErrors.recipeYield = 'Mindestens 1 Portion erforderlich';
        }

        // Validate ingredients
        ingredientListContent.forEach((content, index) => {
            if (content.contentType === 'INGREDIENT') {
                if (!content.ingredientName?.trim()) {
                    newErrors[`ingredient-${index}`] = 'Zutatenname erforderlich';
                }
            } else if (content.contentType === 'SECTION_CAPTION') {
                if (!content.sectionName?.trim()) {
                    newErrors[`section-${index}`] = 'Abschnittsname erforderlich';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [name, recipeYield, ingredientListContent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSaving(true);

        try {
            const data = {
                name: name.trim(),
                recipeYield,
                recipeInstructions,
                ingredientListContent: ingredientListContent.map((c, idx) => ({
                    ...c,
                    position: idx,
                })),
            };

            const url = isEditing ? `/api/recipes/${recipe?._id}` : '/api/recipes';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const savedRecipe = await response.json();
                router.push(`/recipe/${savedRecipe._id}`);
            } else {
                const error = await response.json();
                console.error('Failed to save recipe:', error);
                setErrors({submit: 'Fehler beim Speichern des Rezepts'});
            }
        } catch (error) {
            console.error('Error saving recipe:', error);
            setErrors({submit: 'Fehler beim Speichern des Rezepts'});
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="card p-6 mb-6">
                <h1 className="text-2xl font-bold text-text-dark mb-6">
                    {isEditing ? 'Rezept bearbeiten' : 'Neues Rezept'}
                </h1>

                {/* Recipe Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Rezeptname *
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`input ${errors.name ? 'input-error' : ''}`}
                        placeholder="z.B. Spaghetti Bolognese"
                    />
                    {errors.name && (
                        <p className="text-error text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Portions */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Portionen</label>
                    <PortionControl
                        portions={recipeYield}
                        onIncrease={() => setRecipeYield((p) => p + 1)}
                        onDecrease={() => setRecipeYield((p) => Math.max(1, p - 1))}
                    />
                    {errors.recipeYield && (
                        <p className="text-error text-sm mt-1">{errors.recipeYield}</p>
                    )}
                </div>
            </div>

            {/* Ingredients */}
            <div className="card p-6 mb-6">
                <h2 className="section-header">Zutaten</h2>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="ingredients">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-3"
                            >
                                {ingredientListContent.map((content, index) => (
                                    <Draggable
                                        key={content.contentId}
                                        draggableId={content.contentId}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg ${
                                                    snapshot.isDragging ? 'shadow-lg' : ''
                                                }`}
                                            >
                                                {/* Drag Handle */}
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="drag-handle p-1"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faGripVertical}
                                                        className="w-4 h-4"
                                                    />
                                                </div>

                                                {content.contentType === 'INGREDIENT' ? (
                                                    <>
                                                        {/* Amount */}
                                                        <input
                                                            type="number"
                                                            value={content.amount ?? ''}
                                                            onChange={(e) =>
                                                                handleContentChange(
                                                                    content.contentId,
                                                                    'amount',
                                                                    e.target.value ? parseFloat(e.target.value) : ''
                                                                )
                                                            }
                                                            className="input w-20"
                                                            placeholder="Menge"
                                                            step="any"
                                                        />

                                                        {/* Unit */}
                                                        <input
                                                            type="text"
                                                            value={content.unit ?? ''}
                                                            onChange={(e) =>
                                                                handleContentChange(
                                                                    content.contentId,
                                                                    'unit',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="input w-20"
                                                            placeholder="Einheit"
                                                        />

                                                        {/* Ingredient Name */}
                                                        <input
                                                            type="text"
                                                            value={content.ingredientName ?? ''}
                                                            onChange={(e) =>
                                                                handleContentChange(
                                                                    content.contentId,
                                                                    'ingredientName',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={`input flex-1 ${
                                                                errors[`ingredient-${index}`] ? 'input-error' : ''
                                                            }`}
                                                            placeholder="Zutat"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Section Caption */}
                                                        <input
                                                            type="text"
                                                            value={content.sectionName ?? ''}
                                                            onChange={(e) =>
                                                                handleContentChange(
                                                                    content.contentId,
                                                                    'sectionName',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={`input flex-1 font-bold ${
                                                                errors[`section-${index}`] ? 'input-error' : ''
                                                            }`}
                                                            placeholder="Abschnitt (z.B. Sauce)"
                                                        />
                                                    </>
                                                )}

                                                {/* Delete Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveContent(content.contentId)}
                                                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {/* Add Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4"/>
                        Zutat hinzufügen
                    </button>
                    <button
                        type="button"
                        onClick={handleAddSection}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4"/>
                        Abschnitt hinzufügen
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="card p-6 mb-6">
                <h2 className="section-header">Zubereitung</h2>
                <textarea
                    value={recipeInstructions}
                    onChange={(e) => setRecipeInstructions(e.target.value)}
                    className="input textarea-auto"
                    placeholder="Beschreibe hier die Zubereitung... (Markdown wird unterstützt)"
                    rows={6}
                />
            </div>

            {/* Submit */}
            {errors.submit && (
                <p className="text-error text-center mb-4">{errors.submit}</p>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn btn-outline"
                >
                    Abbrechen
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="btn btn-primary flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <span
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                            Speichern...
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faSave} className="w-4 h-4"/>
                            Speichern
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
