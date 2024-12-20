import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {saveRecipe} from '../../../Api';
import './RecipeForm.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGripLines, faTrash} from '@fortawesome/free-solid-svg-icons';
import {Recipe} from "../../../types/recipe";
import {PortionChange} from "../../../types/portion-change";
import {Ingredient, SectionCaption} from "../../../types/ingredient";
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import {v4 as uuidv4} from 'uuid';
import {useRecipe} from "../../../hooks/useRecipe";
import PortionControl from "../../react-components/portionControl/PortionControl";

const RecipeForm: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {recipe, setRecipe, loading, error} = useRecipe(id);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (recipe?.recipeInstructions) {
            adjustTextareaHeight();
        }
    }, [recipe?.recipeInstructions]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    const changePortion = (changeType: PortionChange) => {
        if (recipe) {
            const delta = changeType === PortionChange.INCREASE ? 1 : -1;
            setRecipe({
                ...recipe,
                recipeYield: Math.max(1, recipe.recipeYield + delta),
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        if (recipe) {
            setRecipe({
                ...recipe,
                [name]: name === 'recipeYield' ? parseInt(value, 10) : value,
            });
        }
    };

    const handleContentChange = (index: number, field: string, value: string) => {
        if (recipe) {
            const newContent = [...recipe.ingredientListContent];
            if (newContent[index].contentType === 'INGREDIENT') {
                const ingredient = newContent[index] as Ingredient;
                newContent[index] = {
                    ...ingredient,
                    [field]: field === "amount" && value === "" ? "" : value,
                };
            } else if (newContent[index].contentType === 'SECTION_CAPTION') {
                const section = newContent[index] as SectionCaption;
                newContent[index] = {
                    ...section,
                    [field]: value,
                };
            }
            setRecipe({
                ...recipe,
                ingredientListContent: newContent,
            });
        }
    };

    const addIngredient = () => {
        if (recipe) {
            setRecipe({
                ...recipe,
                ingredientListContent: [
                    ...recipe.ingredientListContent,
                    {
                        contentId: uuidv4(),
                        ingredientName: '',
                        amount: '',
                        unit: '',
                        position: recipe.ingredientListContent.length,
                        contentType: 'INGREDIENT',
                    } as Ingredient,
                ],
            });
        }
    };

    const addSection = () => {
        if (recipe) {
            setRecipe({
                ...recipe,
                ingredientListContent: [
                    ...recipe.ingredientListContent,
                    {
                        contentId: uuidv4(),
                        sectionName: '',
                        position: recipe.ingredientListContent.length,
                        contentType: 'SECTION_CAPTION',
                    } as SectionCaption,
                ],
            });
        }
    };

    const removeContent = (index: number) => {
        if (recipe) {
            const newContent = recipe.ingredientListContent.filter((_, i) => i !== index);
            setRecipe({
                ...recipe,
                ingredientListContent: newContent.map((content, i) => ({
                    ...content,
                    position: i,
                })),
            });
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !recipe) return;

        const reorderedContent = Array.from(recipe.ingredientListContent);
        const [movedContent] = reorderedContent.splice(result.source.index, 1);
        reorderedContent.splice(result.destination.index, 0, movedContent);

        setRecipe({
            ...recipe,
            ingredientListContent: reorderedContent.map((content, index) => ({
                ...content,
                position: index,
            })),
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!recipe) return;

        try {
            const contentWithUpdatedPositions = recipe.ingredientListContent.map((content, index) => ({
                ...content,
                position: index,
            }));

            const recipeToSave = {...recipe, ingredientListContent: contentWithUpdatedPositions};

            const savedRecipe: Recipe = await saveRecipe(recipeToSave);
            navigate(`/recipe/${savedRecipe.recipeId}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return <div>Fehler beim Laden des Rezepts</div>;
    }

    return (
        <div className="recipe-form-page">
            <h1 className="recipe-form-title">{id ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}</h1>
            <div className="recipe-form-container">
                <form onSubmit={handleSubmit}>
                    <button type="submit" className="save-button" disabled={isSubmitting}>
                        {isSubmitting ? <span className="button-spinner"></span> : 'Speichern'}
                    </button>

                    <div className="form-group-inline">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={recipe?.name || ''}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <PortionControl
                        portion={recipe?.recipeYield as number}
                        changePortion={changePortion}
                    />

                    <div className="form-instructions">
                        <h2>Anleitung (Markdown unterstützt):</h2>
                        <textarea
                            id="recipeInstructions"
                            name="recipeInstructions"
                            value={recipe?.recipeInstructions || ''}
                            onChange={handleChange}
                            ref={textareaRef}
                            onInput={adjustTextareaHeight}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-ingredients">
                        <h2>Zutaten</h2>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="content">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {recipe?.ingredientListContent.map((content, index: number) => (
                                            <Draggable key={content.contentId || index}
                                                       draggableId={String(content.contentId || index)}
                                                       index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className="ingredient-input"
                                                    >
                                                        <span {...provided.dragHandleProps} className="drag-handle">
                                                            <FontAwesomeIcon icon={faGripLines}/>
                                                        </span>
                                                        {content.contentType === 'INGREDIENT' && (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={(content as Ingredient).ingredientName}
                                                                    name="ingredientName"
                                                                    placeholder="Name"
                                                                    onChange={(e) => handleContentChange(index, 'ingredientName', e.target.value)}
                                                                    required
                                                                    disabled={isSubmitting}
                                                                    autoComplete="new-password"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    className="ingredient-amount-input"
                                                                    value={(content as Ingredient).amount !== undefined ? String((content as Ingredient).amount) : ""}
                                                                    name="amount"
                                                                    placeholder="Menge (optional)"
                                                                    onChange={(e) => handleContentChange(index, 'amount', e.target.value)}
                                                                    disabled={isSubmitting}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={(content as Ingredient).unit || ''}
                                                                    name="unit"
                                                                    placeholder="Einheit (optional)"
                                                                    onChange={(e) => handleContentChange(index, 'unit', e.target.value)}
                                                                    disabled={isSubmitting}
                                                                />
                                                            </div>
                                                        )}
                                                        {content.contentType === 'SECTION_CAPTION' && (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={(content as SectionCaption).sectionName}
                                                                    name="sectionName"
                                                                    placeholder="Sektion"
                                                                    onChange={(e) => handleContentChange(index, 'sectionName', e.target.value)}
                                                                    required
                                                                    disabled={isSubmitting}
                                                                />
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="delete-ingredient-button"
                                                            onClick={() => removeContent(index)}
                                                            disabled={isSubmitting}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash}/>
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
                        <button type="button" className="add-ingredient-button" onClick={addIngredient}
                                disabled={isSubmitting}>
                            Zutat hinzufügen
                        </button>
                        <button type="button" className="add-section-button" onClick={addSection}
                                disabled={isSubmitting}>
                            Sektion hinzufügen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecipeForm;
