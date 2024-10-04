import {Link, useNavigate, useParams} from 'react-router-dom';
import {deleteRecipe} from '../../../Api';
import QRCode from 'qrcode.react';
import {marked} from 'marked';
import './RecipeDetail.css';
import {faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRecipe} from "../../../hooks/useRecipe";
import {generateBringUrl} from "../../../utils/generateBringUrl";
import {useEffect, useState} from "react";
import {Ingredient} from '../../../types/ingredient';

const RecipeDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const {recipe, loading, error} = useRecipe(id);
    const [portion, setPortion] = useState<number>(recipe?.recipeYield || 1); // Aktuelle Portionsanzahl
    const [adjustedIngredients, setAdjustedIngredients] = useState<Ingredient[]>([]); // Angepasste Zutatenliste

    useEffect(() => {
        if (recipe) {
            const savedPortion = localStorage.getItem(`recipe-portion-${recipe.recipeId}`);
            if (savedPortion) {
                setPortion(parseInt(savedPortion, 10));
            } else {
                setPortion(recipe.recipeYield);
            }
            setAdjustedIngredients(recipe.ingredients);
        }
    }, [recipe]);

    useEffect(() => {
        if (recipe) {
            localStorage.setItem(`recipe-portion-${recipe.recipeId}`, portion.toString());
        }
    }, [portion, recipe]);

    useEffect(() => {
        if (recipe) {
            const ratio = portion / recipe.recipeYield;
            const updatedIngredients = recipe.ingredients.map((ingredient) => ({
                ...ingredient,
                amount: Math.round(parseFloat(String(ingredient.amount).replace(',', '.')) * ratio * 100) / 100,
            }));
            setAdjustedIngredients(updatedIngredients);
        }
    }, [portion, recipe]);

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

    const increasePortion = () => setPortion((prev) => prev + 1);
    const decreasePortion = () => setPortion((prev) => (prev > 1 ? prev - 1 : 1));

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
                        <QRCode value={generateBringUrl(recipe, portion)} size={64}/>
                    </div>
                </div>
                <hr className="divider"/>

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
                            {adjustedIngredients.map((ingredient: Ingredient, index: number) => (
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
                        <QRCode value={generateBringUrl(recipe, portion)} size={256}/>
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
