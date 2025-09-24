import {Link, useNavigate, useParams} from 'react-router-dom';
import {deleteRecipe} from '../../../Api';
import QRCode from 'qrcode.react';
import './RecipeDetail.css';
import {faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRecipe} from "../../../hooks/useRecipe";
import {useBringDeeplink} from "../../../hooks/useBringDeeplink";
// import {getBringDeeplink} from "../../../utils/generateBringUrl";
import {useEffect, useState} from "react";
import {Ingredient, IngredientListContent, SectionCaption} from '../../../types/ingredient';
import ContentItem from "../../react-components/ContentItem";
import RecipeInstructions from "../../react-components/recipeInstructions/RecipeInstructions";
import PortionControl from "../../react-components/portionControl/PortionControl";
import {PortionChange} from "../../../types/portion-change";

const RecipeDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [isQrCodeOpen, setIsQrCodeOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const {recipe, loading, error} = useRecipe(id);
    const [portion, setPortion] = useState<number>(recipe?.recipeYield || 1); // Aktuelle Portionsanzahl
    const [adjustedContent, setAdjustedContent] = useState<IngredientListContent[]>([]); // Angepasste Inhaltsliste
    const {deeplinkUrl} = useBringDeeplink(id);

    useEffect(() => {
        if (recipe) {
            const savedPortion = localStorage.getItem(`recipe-portion-${recipe.recipeId}`);
            if (savedPortion) {
                setPortion(parseInt(savedPortion, 10));
            } else {
                setPortion(recipe.recipeYield);
            }
            setAdjustedContent(recipe.ingredientListContent);
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
            const updatedContent = recipe.ingredientListContent.map((content) => {
                if (content.contentType === 'INGREDIENT') {
                    const ingredient = content as Ingredient;
                    return {
                ...ingredient,
                amount: ingredient.amount !== undefined && ingredient.amount !== null
                    ? Math.round(parseFloat(String(ingredient.amount).replace(',', '.')) * ratio * 100) / 100
                    : '',
                    };
                }
                return content; // SectionCaption bleibt unverändert
            });
            setAdjustedContent(updatedContent);
        }
    }, [portion, recipe]);

    const handleDelete = async () => {
        if (id) {
            await deleteRecipe(id);
            navigate(`/`);
        }
    };

    const toggleQrCode = () => {
        setIsQrCodeOpen(!isQrCodeOpen);
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

    const changePortion = (changeType: PortionChange) => {
        if (recipe) {
            const delta = changeType === PortionChange.INCREASE ? 1 : -1;
            setPortion((prev) => prev + delta)
        }
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
                    <div className="qr-code" onClick={toggleQrCode}>
                        <QRCode value={deeplinkUrl} size={64}/>
                    </div>
                </div>
                <hr className="divider"/>

                <PortionControl
                    portion={portion}
                    changePortion={changePortion}
                />

                <div className="recipe-content">
                    <div className="recipe-ingredients">
                        <h2>Zutaten</h2>
                        <div className="ingredients-list">
                            {adjustedContent.map((content, index) => (
                                <ContentItem
                                    key={content.contentId || index}
                                    contentType={content.contentType}
                                    ingredientName={(content as Ingredient).ingredientName}
                                    amount={(content as Ingredient).amount}
                                    unit={(content as Ingredient).unit}
                                    sectionName={(content as SectionCaption).sectionName}
                                />
                            ))}
                        </div>
                    </div>
                    <RecipeInstructions instructions={recipe.recipeInstructions}/>
                </div>
            </div>

            {isQrCodeOpen && (
                <div className="modal-qr-code" onClick={toggleQrCode}>
                    <QRCode className="qr-code-open" value={deeplinkUrl} size={256}/>
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
