import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {deleteRecipe, fetchRecipeById} from '../../../Api';
import QRCode from 'qrcode.react';
import {marked} from 'marked';
import './RecipeDetail.css';
import {faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const RecipeDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            fetchRecipeById(id)
                .then((data) => {
                    if (data) {
                        setRecipe(data);
                    } else {
                        setError(true);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleDelete = async () => {
        if (id) {
            await deleteRecipe(id);
            window.location.href = '/';
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !recipe) {
        return <div>Rezept nicht gefunden</div>;
    }

    return (
        <div className="recipe-detail-container">
            <div className="recipe-actions">
                <Link to={`/edit/${recipe.recipeId}`} className="edit-button">
                    <FontAwesomeIcon icon={faPen}/> Bearbeiten
                </Link>
                <button onClick={handleDelete} className="delete-button">
                    <FontAwesomeIcon icon={faTrash}/> Löschen
                </button>
            </div>

            <div className="recipe-card">
                <div className="recipe-header">
                    <h1 className="recipe-name">{recipe.name}</h1>
                    <div className="qr-code" onClick={toggleModal}>
                        <QRCode value={window.location.href} size={64}/>
                    </div>
                </div>
                <hr className="divider"/>
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
                            dangerouslySetInnerHTML={{__html: marked(recipe.recipeInstructions) as string}}
                        />
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal" onClick={toggleModal}>
                    <div className="modal-content">
                        <QRCode value={window.location.href} size={256}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeDetail;
