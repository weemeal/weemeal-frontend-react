import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchRecipes} from '../../../Api';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode.react';
import './RecipeList.css';
import {generateBringUrl} from "../../../utils/generateBringUrl";
import {Recipe} from "../../../types/recipe";

const RecipeList: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes()
            .then((data: Recipe[]) => {
                setRecipes(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const handleCardClick = (id: string) => {
        navigate(`/recipe/${id}`);
    };

    const handleNewRecipeClick = () => {
        navigate("/new");
    };

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="recipe-list-container">
            <div className="search-and-button-container">
                <input
                    type="text"
                    placeholder="Suche Rezepte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button className="new-recipe-button" onClick={handleNewRecipeClick}>
                    <FontAwesomeIcon icon={faPlus}/> Neues Rezept
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="recipe-list">
                    {filteredRecipes.map((recipe: Recipe) => (
                        <div className="card" key={recipe.recipeId} onClick={() => handleCardClick(recipe.recipeId)}>
                            <div className="recipe-name">{recipe.name}</div>
                            <div className="qr-code">
                                <QRCode value={generateBringUrl(recipe)} size={64}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeList;