import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipeById, deleteRecipe } from '../Api';
import QRCode from 'qrcode.react';
import { marked } from 'marked';
import './RecipeDetail.css';

const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Ladezustand
    const [error, setError] = useState<boolean>(false); // Fehlerzustand

    useEffect(() => {
        if (id) {
            fetchRecipeById(id)
                .then((data) => {
                    if (data) {
                        setRecipe(data);
                    } else {
                        setError(true);
                    }
                    setLoading(false); // Laden abgeschlossen
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                    setLoading(false); // Auch im Fehlerfall das Laden stoppen
                });
        }
    }, [id]);

  const handleDelete = async () => {
        if (id) {
            await deleteRecipe(id);
            window.location.href = '/';
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div> {/* Ladekreis */}
            </div>
        );
    }

    if (error || !recipe) {
        return <div>Rezept nicht gefunden</div>;
    }

    return (
        <div className="recipe-detail-container">
            <div className="recipe-header">
                <Link to={`/edit/${recipe.recipeId}`} className="edit-button">
                    ✏️
                </Link>
                <h1 className="recipe-name">{recipe.name}</h1>
                <QRCode value={window.location.href} className="qr-code" />
            </div>
            <button onClick={handleDelete} className="delete-button">Löschen</button>
            <p className="recipe-portions"><strong>Portionen:</strong> {recipe.recipeYield}</p>
            <div className="recipe-content">
                <div className="recipe-ingredients">
                    <h2>Zutaten</h2>
                    <div className="ingredients-list">
                        {recipe.ingredients.map((ingredient: string, index: number) => (
                            <div key={index} className="ingredient-card">
                                {ingredient}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="recipe-instructions">
                    <h2>Zubereitung</h2>
                    <div
                        className="instructions-content"
                        dangerouslySetInnerHTML={{ __html: marked(recipe.recipeInstructions) as string }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
