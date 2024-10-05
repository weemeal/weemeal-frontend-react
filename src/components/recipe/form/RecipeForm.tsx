import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {saveRecipe} from '../../../Api';
import './RecipeForm.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGripLines, faTrash} from '@fortawesome/free-solid-svg-icons';
import {Recipe} from "../../../types/recipe";
import {PortionChange} from "../../../types/portion-change";
import {Ingredient} from "../../../types/ingredient";
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import {v4 as uuidv4} from 'uuid';
import {useRecipe} from "../../../hooks/useRecipe";

const RecipeForm: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {recipe, setRecipe, loading, error} = useRecipe(id);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (recipe) {
            adjustTextareaHeight();
        }
    }, [recipe]);

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

    const handleIngredientChange = (index: number, field: string, value: string) => {
        if (recipe) {
            const newIngredients = [...recipe.ingredients];
            newIngredients[index] = {
                ...newIngredients[index],
                [field]: field === "amount" && value === "" ? "" : value,
            };
            setRecipe({
                ...recipe,
                ingredients: newIngredients,
            });
        }
    };

    const addIngredient = () => {
        if (recipe) {
            setRecipe({
                ...recipe,
                ingredients: [
                    ...recipe.ingredients,
                    {
                        ingredientName: '',
                        amount: '',
                        unit: '',
                        position: recipe.ingredients.length,
                        dragDummy: uuidv4(),
                    } as Ingredient,
                ],
            });
        }
    };

    const removeIngredient = (index: number) => {
        if (recipe) {
            const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
            setRecipe({
                ...recipe,
                ingredients: newIngredients.map((ingredient, i) => ({
                    ...ingredient,
                    position: i,
                })),
            });
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !recipe) return;

        const reorderedIngredients = Array.from(recipe.ingredients);
        const [movedIngredient] = reorderedIngredients.splice(result.source.index, 1);
        reorderedIngredients.splice(result.destination.index, 0, movedIngredient);

        setRecipe({
            ...recipe,
            ingredients: reorderedIngredients.map((ingredient, index) => ({
                ...ingredient,
                position: index,
            })),
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!recipe) return;

        try {
            const ingredientsWithUpdatedPositions = recipe.ingredients.map((ingredient, index) => ({
                ...ingredient,
                position: index,
            }));

            const recipeToSave = {...recipe, ingredients: ingredientsWithUpdatedPositions};

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

                    <div className="form-group-inline">
                        <label htmlFor="recipeYield">Portionen:</label>
                        <div className="portion-controls">
                            <button
                                type="button"
                                className="portion-button"
                                onClick={() => changePortion(PortionChange.DECREASE)}
                                disabled={isSubmitting}
                            >
                                -
                            </button>
                            <span>{recipe?.recipeYield}</span>
                            <button
                                type="button"
                                className="portion-button"
                                onClick={() => changePortion(PortionChange.INCREASE)}
                                disabled={isSubmitting}
                            >
                                +
                            </button>
                        </div>
                    </div>

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
                        <h2>Zutaten:</h2>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="ingredients">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {recipe?.ingredients.map((ingredient: Ingredient, index: number) => (
                                            <Draggable key={ingredient.ingredientId || index}
                                                       draggableId={String(ingredient.ingredientId ?? ingredient.dragDummy)}
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
                                                        <input
                                                            type="text"
                                                            value={ingredient.ingredientName}
                                                            name="ingredientName"
                                                            placeholder="Name"
                                                            onChange={(e) => handleIngredientChange(index, 'ingredientName', e.target.value)}
                                                            required
                                                            disabled={isSubmitting}
                                                        />
                                                        <input
                                                            type="number"
                                                            className="ingredient-amount-input"
                                                            value={ingredient.amount !== undefined ? String(ingredient.amount) : ""}
                                                            name="amount"
                                                            placeholder="Menge (optional)"
                                                            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                                            disabled={isSubmitting}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={ingredient.unit || ''}
                                                            name="unit"
                                                            placeholder="Einheit (optional)"
                                                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                                            disabled={isSubmitting}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="delete-ingredient-button"
                                                            onClick={() => removeIngredient(index)}
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecipeForm;