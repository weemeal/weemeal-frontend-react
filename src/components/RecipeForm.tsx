// src/components/RecipeForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import { v4 as uuidv4 } from 'uuid';
import './RecipeForm.css'; // Importiere das CSS

const RecipeForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<Recipe>({
        id: '',
        name: '',
        portion: 1,
        instructions: '',
        ingredients: [],
    });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (id) {
            const storedRecipes = localStorage.getItem('recipes');
            if (storedRecipes) {
                const recipes: Recipe[] = JSON.parse(storedRecipes);
                const foundRecipe = recipes.find((r) => r.id === id);
                if (foundRecipe) {
                    setRecipe(foundRecipe);
                }
            }
        }
    }, [id]);

  useEffect(() => {
    adjustTextareaHeight(); // Anpassung der Textarea-Höhe beim ersten Rendern
  }, [recipe.instructions]); // Trigger auf Anleitungsänderung

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            [name]: name === 'portion' ? parseInt(value, 10) : value,
        }));
    };

  // Funktion zum Erhöhen der Portionen
  const increasePortion = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      portion: prevRecipe.portion + 1,
    }));
  };

  // Funktion zum Verringern der Portionen
  const decreasePortion = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      portion: prevRecipe.portion > 1 ? prevRecipe.portion - 1 : 1,
    }));
  };

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients[index] = value;
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            ingredients: newIngredients,
        }));
    };

    const addIngredient = () => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            ingredients: [...prevRecipe.ingredients, ''],
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const storedRecipes = localStorage.getItem('recipes');
        const recipes: Recipe[] = storedRecipes ? JSON.parse(storedRecipes) : [];
        if (id) {
            const updatedRecipes = recipes.map((r) => (r.id === id ? recipe : r));
            localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
        } else {
            const newRecipe = { ...recipe, id: uuidv4() };
            recipes.push(newRecipe);
            localStorage.setItem('recipes', JSON.stringify(recipes));
        }
        navigate('/');
    };

  // Funktion zur dynamischen Anpassung der Textarea-Höhe
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Setzt die Höhe zurück
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; // Setzt die Höhe auf den Scroll-Höhenwert
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
                    <label htmlFor="portion">Portionen:</label>
                    <div className="portion-controls">
                        <button type="button" className="portion-button" onClick={decreasePortion}>-</button>
                        <span>{recipe.portion}</span>
                        <button type="button" className="portion-button" onClick={increasePortion}>+</button>
                    </div>
                </div>
                <div className="form-content">
                    <div className="form-ingredients">
                        <h2>Zutaten:</h2>
                        {recipe.ingredients.map((ingredient, index) => (
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
                            id="instructions"
                            name="instructions"
                            value={recipe.instructions}
                            onChange={handleChange}
                            ref={textareaRef}
                            onInput={adjustTextareaHeight} // Ereignis zum Anpassen der Höhe
                            required
                        />
                    </div>
                </div>

            </form>
        </div>
    );
};

export default RecipeForm;
