import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRecipeById, createRecipe, updateRecipe } from '../Api';
import './RecipeForm.css';

const RecipeForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<any>({
        recipeId: '',
        name: '',
        recipeYield: 1,
        recipeInstructions: '',
        ingredients: [],
    });
    const [loading, setLoading] = useState<boolean>(!!id); // Ladezustand nur bei Bearbeitung auf true
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Zustand für das Speichern
    const [error, setError] = useState<boolean>(false); // Fehlerzustand

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (id) {
            fetchRecipeById(id)
                .then((data) => {
                    setRecipe(data);
                    setLoading(false); // Laden abgeschlossen
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                    setLoading(false); // Auch im Fehlerfall das Laden stoppen
                });
        }
    }, [id]);

  useEffect(() => {
        adjustTextareaHeight();
    }, [recipe.recipeInstructions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRecipe((prevRecipe: any) => ({
            ...prevRecipe,
            [name]: name === 'recipeYield' ? parseInt(value, 10) : value,
        }));
    };

  const increasePortion = () => {
        setRecipe((prevRecipe: any) => ({
      ...prevRecipe,
            recipeYield: prevRecipe.recipeYield + 1,
    }));
  };

  const decreasePortion = () => {
        setRecipe((prevRecipe: any) => ({
      ...prevRecipe,
            recipeYield: prevRecipe.recipeYield > 1 ? prevRecipe.recipeYield - 1 : 1,
    }));
  };

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients[index] = value;
        setRecipe((prevRecipe: any) => ({
            ...prevRecipe,
            ingredients: newIngredients,
        }));
    };

    const addIngredient = () => {
        setRecipe((prevRecipe: any) => ({
            ...prevRecipe,
            ingredients: [...prevRecipe.ingredients, ''],
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true); // Speichervorgang startet

        try {
        if (id) {
                await updateRecipe(recipe);
                navigate(`/recipe/${id}`); // Zur Detailseite des aktualisierten Rezepts
        } else {
                const newRecipe = await createRecipe(recipe);
                navigate(`/recipe/${newRecipe.recipeId}`); // Zur Detailseite des neuen Rezepts
        }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false); // Speichervorgang abgeschlossen
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
                <div className="spinner"></div> {/* Ladekreis */}
            </div>
        );
    }

    if (error) {
        return <div>Fehler beim Laden des Rezepts</div>;
    }

    return (
        <div className="recipe-form-container">
            <h1>{id ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}</h1>
            <form onSubmit={handleSubmit}>
                <button type="submit" className="save-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="button-spinner"></span> // Ladespinner im Button
                    ) : (
                        'Speichern'
                    )}
                </button>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={recipe.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting} // Eingabefelder deaktiviert, wenn speichert
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="recipeYield">Portionen:</label>
                    <div className="portion-controls">
                        <button
                            type="button"
                            className="portion-button"
                            onClick={decreasePortion}
                            disabled={isSubmitting} // Button deaktiviert, wenn speichert
                        >
                            -
                        </button>
                        <span>{recipe.recipeYield}</span>
                        <button
                            type="button"
                            className="portion-button"
                            onClick={increasePortion}
                            disabled={isSubmitting} // Button deaktiviert, wenn speichert
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="form-content">
                    <div className="form-ingredients">
                        <h2>Zutaten:</h2>
                        {recipe.ingredients.map((ingredient: string, index: number) => (
                            <div key={index} className="ingredient-input">
                                <input
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    required
                                    disabled={isSubmitting} // Eingabefelder deaktiviert, wenn speichert
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            className="add-ingredient-button"
                            onClick={addIngredient}
                            disabled={isSubmitting} // Button deaktiviert, wenn speichert
                        >
                            Zutat hinzufügen
                        </button>
                    </div>
                    <div className="form-instructions">
                        <h2>Anleitung (Markdown unterstützt):</h2>
                        <textarea
                            id="recipeInstructions"
                            name="recipeInstructions"
                            value={recipe.recipeInstructions}
                            onChange={handleChange}
                            ref={textareaRef}
                            onInput={adjustTextareaHeight}
                            required
                            disabled={isSubmitting} // Textarea deaktiviert, wenn speichert
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RecipeForm;
