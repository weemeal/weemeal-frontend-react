import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRecipeById, createRecipe, updateRecipe } from '../api';
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

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (id) {
            fetchRecipeById(id).then(setRecipe).catch(console.error);
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

  // Funktion zum Erhöhen der Portionen
  const increasePortion = () => {
        setRecipe((prevRecipe: any) => ({
      ...prevRecipe,
            recipeYield: prevRecipe.recipeYield + 1,
    }));
  };

  // Funktion zum Verringern der Portionen
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
        try {
        if (id) {
                await updateRecipe(recipe);
        } else {
                await createRecipe(recipe);
        }
        navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

  // Funktion zur dynamischen Anpassung der Textarea-Höhe
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

    return (
        <div className="recipe-form-container">
            <h1>{id ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}</h1>
            <form onSubmit={handleSubmit}>
                <button type="submit" className="save-button">Speichern</button>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={recipe.name} onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="recipeYield">Portionen:</label>
                    <div className="portion-controls">
                        <button type="button" className="portion-button" onClick={decreasePortion}>-</button>
                        <span>{recipe.recipeYield}</span>
                        <button type="button" className="portion-button" onClick={increasePortion}>+</button>
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
                                />
                            </div>
                        ))}
                        <button type="button" className="add-ingredient-button" onClick={addIngredient}>
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
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default RecipeForm;
