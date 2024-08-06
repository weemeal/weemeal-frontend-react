// src/components/RecipeForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import { v4 as uuidv4 } from 'uuid';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            [name]: name === 'portion' ? parseInt(value, 10) : value,
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

    return (
        <div>
            <h1>{id ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={recipe.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="portion">Portionen:</label>
                    <input type="number" id="portion" name="portion" value={recipe.portion} onChange={handleChange} required />
                </div>
                <div>
          <label htmlFor="instructions">Anleitung (Markdown unterstützt):</label>
                    <textarea id="instructions" name="instructions" value={recipe.instructions} onChange={handleChange} required />
                </div>
                <div>
                    <label>Zutaten:</label>
                    {recipe.ingredients.map((ingredient, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addIngredient}>
                        Zutat hinzufügen
                    </button>
                </div>
                <button type="submit">Speichern</button>
            </form>
        </div>
    );
};

export default RecipeForm;
