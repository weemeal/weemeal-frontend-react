// src/components/RecipeDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import QRCode from 'qrcode.react';
import { marked } from 'marked'; // Importiere die `marked`-Funktion
import './RecipeDetail.css';

const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [portion, setPortion] = useState<number>(1); // Zustand für Portionen

    useEffect(() => {
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
            const recipes: Recipe[] = JSON.parse(storedRecipes);
            const foundRecipe = recipes.find((r) => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setPortion(foundRecipe.portion);
      }
        }
    }, [id]);

  // Funktion zum Erhöhen der Portionen
  const increasePortion = () => {
    setPortion(prevPortion => {
      const newPortion = prevPortion + 1;
      updateLocalStorage(newPortion);
      return newPortion;
    });
  };

  // Funktion zum Verringern der Portionen
  const decreasePortion = () => {
    setPortion(prevPortion => {
      const newPortion = prevPortion > 1 ? prevPortion - 1 : 1;
      updateLocalStorage(newPortion);
      return newPortion;
    });
  };

  // Funktion zum Aktualisieren des LocalStorage
  const updateLocalStorage = (newPortion: number) => {
    if (!recipe) return;

    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      const recipes: Recipe[] = JSON.parse(storedRecipes);
      const updatedRecipes = recipes.map(r => r.id === recipe.id ? { ...r, portion: newPortion } : r);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    }
  };

  // Funktion zur Anpassung der Zutatenmengen
  const getAdjustedIngredients = () => {
    if (!recipe) return [];
    const factor = portion / recipe.portion; // Berechnung des Anpassungsfaktors
    return recipe.ingredients.map(ingredient => {
      // Hier kannst du die tatsächliche Zutatenanpassung implementieren, falls es spezifische Mengen gibt.
      // Für jetzt nehmen wir an, dass die Zutaten einfach aufgelistet sind.
      return `${ingredient}`; // Anpassung der Zutatenbeschreibung
    });
  };

    if (!recipe) {
        return <div>Rezept nicht gefunden</div>;
    }

    return (
        <div className="recipe-detail-container">
            <div className="recipe-header">
                <Link to={`/edit/${recipe.id}`} className="edit-button">
                    ✏️
                </Link>
                <h1 className="recipe-name">{recipe.name}</h1>
                <QRCode value={window.location.href} className="qr-code" />
            </div>
      <div className="recipe-portions">
        <strong>Portionen:</strong>
        <button className="portion-button" onClick={decreasePortion}>-</button>
        <span>{portion}</span>
        <button className="portion-button" onClick={increasePortion}>+</button>
      </div>
            <div className="recipe-content">
                <div className="recipe-ingredients">
                    <h2>Zutaten</h2>
                    <div className="ingredients-list">
            {getAdjustedIngredients().map((ingredient, index) => (
                            <div key={index} className="ingredient-card">
                                {ingredient}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="recipe-instructions">
                    <h2>Zubereitung</h2>
                    {/* Markdown-Inhalte parsen und als HTML rendern */}
                    <div
                        className="instructions-content"
                        dangerouslySetInnerHTML={{ __html: marked(recipe.instructions) as string }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
