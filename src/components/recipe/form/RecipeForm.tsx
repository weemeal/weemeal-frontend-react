import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchRecipeById, saveRecipe} from '../../../Api';
import './RecipeForm.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';


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
    const [loading, setLoading] = useState<boolean>(!!id);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (id) {
            fetchRecipeById(id)
                .then((data) => {
                    setRecipe(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                    setLoading(false);
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

    const handleIngredientChange = (index: number, field: string, value: string) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            [field]: value,
        };
        setRecipe((prevRecipe: any) => ({
            ...prevRecipe,
            ingredients: newIngredients,
        }));
    };

    const addIngredient = () => {
        setRecipe((prevRecipe: any) => ({
            ...prevRecipe,
            ingredients: [
                ...prevRecipe.ingredients,
                {ingredientId: '', ingredientName: '', amount: '', unit: ''},
            ],
        }));
    };

    const removeIngredient = (index: number) => {
        const newIngredients = recipe.ingredients.filter((_: any, i: number) => i !== index);
        setRecipe((prevRecipe: any) => ({
            ...prevRecipe,
            ingredients: newIngredients,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const savedRecipe = await saveRecipe(recipe);
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
            <h1 className="recipe-form-title">
                {id ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}
            </h1>
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
                        value={recipe.name}
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
                            onClick={decreasePortion}
                            disabled={isSubmitting}
                        >
                            -
                        </button>
                        <span>{recipe.recipeYield}</span>
                        <button
                            type="button"
                            className="portion-button"
                            onClick={increasePortion}
                            disabled={isSubmitting}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="form-content">
                    <div className="form-ingredients">
                        <h2>Zutaten:</h2>
                        {recipe.ingredients.map((ingredient: any, index: number) => (
                            <div key={ingredient.ingredientId || index} className="ingredient-input">
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
                                    type="text"
                                    value={ingredient.amount}
                                    name="amount"
                                    placeholder="Menge"
                                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                                <input
                                    type="text"
                                    value={ingredient.unit}
                                    name="unit"
                                    placeholder="Einheit"
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                    required
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
                        ))}
                        <button
                            type="button"
                            className="add-ingredient-button"
                            onClick={addIngredient}
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </form>
        </div>
        </div>
    );
};

export default RecipeForm;
