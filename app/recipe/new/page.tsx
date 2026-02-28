import RecipeFormView from '@/components/recipe/RecipeFormView';
import {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'Neues Rezept - WeeMeal',
    description: 'Erstelle ein neues Rezept',
};

export default function NewRecipePage() {
    return <RecipeFormView/>;
}
