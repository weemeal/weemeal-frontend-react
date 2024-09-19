import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {deleteRecipe, fetchRecipeById, generateBringUrl} from '../../../Api';
import QRCode from 'qrcode.react';
import {marked} from 'marked';
import './RecipeDetail.css';
import {faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const RecipeDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<any | null>(null);
    const [bringUrl, setBringUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const navigate = useNavigate();

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
        if (recipe) {
            const data = generateBringUrl(recipe)
            if (data) {
                setBringUrl(data);
            } else {
                setError(true)
            }
        }
    }, [id, recipe]);

    const handleDelete = async () => {
        if (id) {
            await deleteRecipe(id);
            navigate(`/`);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const confirmDelete = () => {
        handleDelete();
        closeDeleteDialog();
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
                <button onClick={openDeleteDialog} className="delete-button">
                    <FontAwesomeIcon icon={faTrash}/> Löschen
                </button>
            </div>

            <div className="recipe-card">
                <div className="recipe-header">
                    <h1 className="recipe-name">{recipe.name}</h1>
                    <div className="qr-code" onClick={toggleModal}>
                        <QRCode value={bringUrl} size={64}/>
                    </div>
                </div>
                <hr className="divider"/>
                <p className="recipe-portions"><strong>Portionen:</strong> {recipe.recipeYield}</p>
                <div className="recipe-content">
                    <div className="recipe-ingredients">
                        <h2>Zutaten</h2>
                        <div className="ingredients-list">
                            {recipe.ingredients.map((ingredient: any, index: number) => (
                                <div key={ingredient.ingredientId || index} className="ingredient-card">
                                    {`${ingredient.ingredientName} ${ingredient.amount} ${ingredient.unit}`}
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
                        <QRCode value={bringUrl} size={256}/>
                    </div>
                </div>
            )}

            {isDeleteDialogOpen && (
                <div className="delete-dialog-overlay">
                    <div className="delete-dialog">
                        <h3>Rezept löschen</h3>
                        <p>Bist du sicher, dass du das Rezept löschen möchtest?</p>
                        <div className="dialog-actions">
                            <button className="confirm-button" onClick={confirmDelete}>Ja</button>
                            <button className="cancel-button" onClick={closeDeleteDialog}>Abbrechen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeDetail;
