import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecipes } from '../../../Api';
import QRCode from 'qrcode.react';
import './RecipeList.css';

const RecipeList: React.FC = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Suchbegriff-Zustand
    const [loading, setLoading] = useState<boolean>(true); // Ladezustand
  const navigate = useNavigate();

    useEffect(() => {
        // Rezepte laden und Ladezustand anpassen
        fetchRecipes()
            .then((data) => {
                setRecipes(data);
                setLoading(false); // Laden abgeschlossen
            })
            .catch((error) => {
                console.error(error);
                setLoading(false); // Auch im Fehlerfall das Laden stoppen
            });
    }, []);

  const handleCardClick = (id: string) => {
        navigate(`/recipe/${id}`);
  };

  // Filterlogik basierend auf dem Suchbegriff
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
    <div className="recipe-list-container">
            <h1>Rezeptliste</h1>

      {/* Suchfeld */}
      <input
        type="text"
        placeholder="Suche Rezepte..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

            {/* Ladezustand prüfen */}
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div> {/* Ladekreis hier */}
                </div>
            ) : (
            <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <div className="card" key={recipe.recipeId} onClick={() => handleCardClick(recipe.recipeId)}>
            <div className="recipe-name">{recipe.name}</div>
                        <div className="qr-code">
                            <QRCode value={`${window.location.origin}/recipe/${recipe.recipeId}`} size={64} />
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default RecipeList;
