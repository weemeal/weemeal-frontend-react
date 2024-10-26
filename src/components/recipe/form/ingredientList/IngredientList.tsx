import React from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import {ContentType, Ingredient, SectionCaption} from '../../../../types/ingredient';
import './IngredientList.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGripLines} from "@fortawesome/free-solid-svg-icons";
import IngredientInput from "./IngredientInput";
import SectionInput from "./SectionInput";


interface IngredientListProps {
    ingredientListContent: (Ingredient | SectionCaption)[];
    handleContentChange: (index: number, field: string, value: string) => void;
    removeContent: (index: number) => void;
    handleDragEnd: (result: DropResult) => void;
    isSubmitting: boolean;
}

const IngredientList: React.FC<IngredientListProps> = ({
                                                           ingredientListContent,
                                                           handleContentChange,
                                                           removeContent,
                                                           handleDragEnd,
                                                           isSubmitting
                                                       }) => (
    <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="ingredient-list">
                    {ingredientListContent.map((content, index) => (
                        <Draggable key={content.contentId || index} draggableId={String(content.contentId || index)}
                                   index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="ingredient-item"
                                >
                  <span {...provided.dragHandleProps} className="drag-handle">
                    <FontAwesomeIcon icon={faGripLines}/>
                  </span>
                                    {content.contentType === ContentType.INGREDIENT && (
                                        <IngredientInput
                                            content={content as Ingredient}
                                            index={index}
                                            handleContentChange={handleContentChange}
                                            removeContent={removeContent}
                                            isSubmitting={isSubmitting}
                                        />
                                    )}
                                    {content.contentType === ContentType.SECTION_CAPTION && (
                                        <SectionInput
                                            content={content as SectionCaption}
                                            index={index}
                                            handleContentChange={handleContentChange}
                                            isSubmitting={isSubmitting}
                                        />
                                    )}
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
);

export default IngredientList;