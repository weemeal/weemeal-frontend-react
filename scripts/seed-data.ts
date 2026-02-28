/**
 * Seed Script: Create test data in MongoDB
 *
 * Usage: npx tsx scripts/seed-data.ts
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://weemeal:weemeal_dev@localhost:27017/weemeal?authSource=admin';

// Recipe Schema (inline for seed script)
const IngredientListContentSchema = new mongoose.Schema(
    {
        contentId: {type: String, required: true},
        contentType: {type: String, required: true, enum: ['INGREDIENT', 'SECTION_CAPTION']},
        position: {type: Number, required: true},
        ingredientName: {type: String},
        unit: {type: String},
        amount: {type: Number},
        sectionName: {type: String},
    },
    {_id: false}
);

const RecipeSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        recipeYield: {type: Number, required: true},
        recipeInstructions: {type: String, default: ''},
        ingredientListContent: {type: [IngredientListContentSchema], default: []},
        userId: {type: String},
    },
    {timestamps: true}
);

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

const testRecipes = [
    {
        name: 'Spaghetti Bolognese',
        recipeYield: 4,
        recipeInstructions: `## Zubereitung

1. Zwiebeln und Knoblauch fein hacken und in Olivenöl anbraten
2. Hackfleisch hinzufügen und krümelig braten
3. Tomatenmark einrühren und kurz mitrösten
4. Passierte Tomaten und Brühe hinzugeben
5. Mit Salz, Pfeffer und italienischen Kräutern würzen
6. 30 Minuten köcheln lassen
7. Spaghetti nach Packungsanleitung kochen
8. Sauce über die Pasta geben und mit Parmesan servieren`,
        ingredientListContent: [
            {
                contentId: 'i1',
                contentType: 'INGREDIENT',
                position: 0,
                ingredientName: 'Spaghetti',
                amount: 500,
                unit: 'g'
            },
            {
                contentId: 'i2',
                contentType: 'INGREDIENT',
                position: 1,
                ingredientName: 'Rinderhackfleisch',
                amount: 400,
                unit: 'g'
            },
            {
                contentId: 'i3',
                contentType: 'INGREDIENT',
                position: 2,
                ingredientName: 'Zwiebeln',
                amount: 2,
                unit: 'Stück'
            },
            {
                contentId: 'i4',
                contentType: 'INGREDIENT',
                position: 3,
                ingredientName: 'Knoblauchzehen',
                amount: 3,
                unit: 'Stück'
            },
            {
                contentId: 'i5',
                contentType: 'INGREDIENT',
                position: 4,
                ingredientName: 'Passierte Tomaten',
                amount: 400,
                unit: 'ml'
            },
            {
                contentId: 'i6',
                contentType: 'INGREDIENT',
                position: 5,
                ingredientName: 'Tomatenmark',
                amount: 2,
                unit: 'EL'
            },
            {
                contentId: 'i7',
                contentType: 'INGREDIENT',
                position: 6,
                ingredientName: 'Gemüsebrühe',
                amount: 100,
                unit: 'ml'
            },
            {
                contentId: 'i8',
                contentType: 'INGREDIENT',
                position: 7,
                ingredientName: 'Olivenöl',
                amount: 3,
                unit: 'EL'
            },
            {
                contentId: 'i9',
                contentType: 'INGREDIENT',
                position: 8,
                ingredientName: 'Parmesan',
                amount: 50,
                unit: 'g'
            },
        ],
    },
    {
        name: 'Klassischer Kaiserschmarrn',
        recipeYield: 2,
        recipeInstructions: `## Zubereitung

1. Eier trennen. Eigelb mit Milch, Mehl und einer Prise Salz verrühren
2. Eiweiß steif schlagen und unter den Teig heben
3. Butter in einer Pfanne erhitzen
4. Teig eingießen und bei mittlerer Hitze stocken lassen
5. Mit zwei Gabeln in Stücke reißen
6. Rosinen hinzufügen und mit Puderzucker bestreuen
7. Mit Apfelmus servieren`,
        ingredientListContent: [
            {contentId: 'k1', contentType: 'INGREDIENT', position: 0, ingredientName: 'Eier', amount: 4, unit: 'Stück'},
            {contentId: 'k2', contentType: 'INGREDIENT', position: 1, ingredientName: 'Mehl', amount: 150, unit: 'g'},
            {contentId: 'k3', contentType: 'INGREDIENT', position: 2, ingredientName: 'Milch', amount: 200, unit: 'ml'},
            {contentId: 'k4', contentType: 'INGREDIENT', position: 3, ingredientName: 'Butter', amount: 50, unit: 'g'},
            {
                contentId: 'k5',
                contentType: 'INGREDIENT',
                position: 4,
                ingredientName: 'Puderzucker',
                amount: 30,
                unit: 'g'
            },
            {contentId: 'k6', contentType: 'INGREDIENT', position: 5, ingredientName: 'Rosinen', amount: 50, unit: 'g'},
            {contentId: 'k7', contentType: 'INGREDIENT', position: 6, ingredientName: 'Salz', amount: 1, unit: 'Prise'},
        ],
    },
    {
        name: 'Thai Curry mit Hähnchen',
        recipeYield: 4,
        recipeInstructions: `## Zubereitung

1. Hähnchenbrust in Streifen schneiden
2. Gemüse vorbereiten: Paprika in Streifen, Zucchini in Halbmonde
3. Öl im Wok erhitzen, Hähnchen anbraten und herausnehmen
4. Currypaste im Wok anrösten
5. Kokosmilch hinzugeben und aufkochen
6. Gemüse und Hähnchen hinzufügen
7. 10 Minuten köcheln lassen
8. Mit Fischsauce und Limettensaft abschmecken
9. Mit Thai-Basilikum garnieren und mit Reis servieren`,
        ingredientListContent: [
            {contentId: 't1', contentType: 'SECTION_CAPTION', position: 0, sectionName: 'Hauptzutaten'},
            {
                contentId: 't2',
                contentType: 'INGREDIENT',
                position: 1,
                ingredientName: 'Hähnchenbrust',
                amount: 500,
                unit: 'g'
            },
            {
                contentId: 't3',
                contentType: 'INGREDIENT',
                position: 2,
                ingredientName: 'Kokosmilch',
                amount: 400,
                unit: 'ml'
            },
            {
                contentId: 't4',
                contentType: 'INGREDIENT',
                position: 3,
                ingredientName: 'Rote Currypaste',
                amount: 3,
                unit: 'EL'
            },
            {contentId: 't5', contentType: 'SECTION_CAPTION', position: 4, sectionName: 'Gemüse'},
            {
                contentId: 't6',
                contentType: 'INGREDIENT',
                position: 5,
                ingredientName: 'Paprika rot',
                amount: 1,
                unit: 'Stück'
            },
            {
                contentId: 't7',
                contentType: 'INGREDIENT',
                position: 6,
                ingredientName: 'Paprika gelb',
                amount: 1,
                unit: 'Stück'
            },
            {
                contentId: 't8',
                contentType: 'INGREDIENT',
                position: 7,
                ingredientName: 'Zucchini',
                amount: 1,
                unit: 'Stück'
            },
            {
                contentId: 't9',
                contentType: 'INGREDIENT',
                position: 8,
                ingredientName: 'Bambussprossen',
                amount: 200,
                unit: 'g'
            },
            {contentId: 't10', contentType: 'SECTION_CAPTION', position: 9, sectionName: 'Würzen'},
            {
                contentId: 't11',
                contentType: 'INGREDIENT',
                position: 10,
                ingredientName: 'Fischsauce',
                amount: 2,
                unit: 'EL'
            },
            {
                contentId: 't12',
                contentType: 'INGREDIENT',
                position: 11,
                ingredientName: 'Limettensaft',
                amount: 2,
                unit: 'EL'
            },
            {
                contentId: 't13',
                contentType: 'INGREDIENT',
                position: 12,
                ingredientName: 'Thai-Basilikum',
                amount: 1,
                unit: 'Bund'
            },
            {
                contentId: 't14',
                contentType: 'INGREDIENT',
                position: 13,
                ingredientName: 'Jasminreis',
                amount: 300,
                unit: 'g'
            },
        ],
    },
    {
        name: 'Griechischer Salat',
        recipeYield: 2,
        recipeInstructions: `## Zubereitung

1. Tomaten und Gurke in Würfel schneiden
2. Zwiebel in dünne Ringe schneiden
3. Oliven halbieren
4. Alles in eine Schüssel geben
5. Feta würfeln und darüber verteilen
6. Olivenöl, Essig, Salz und Oregano mischen
7. Dressing über den Salat geben
8. Frisches Brot dazu servieren`,
        ingredientListContent: [
            {
                contentId: 'g1',
                contentType: 'INGREDIENT',
                position: 0,
                ingredientName: 'Tomaten',
                amount: 4,
                unit: 'Stück'
            },
            {
                contentId: 'g2',
                contentType: 'INGREDIENT',
                position: 1,
                ingredientName: 'Salatgurke',
                amount: 1,
                unit: 'Stück'
            },
            {
                contentId: 'g3',
                contentType: 'INGREDIENT',
                position: 2,
                ingredientName: 'Rote Zwiebel',
                amount: 1,
                unit: 'Stück'
            },
            {contentId: 'g4', contentType: 'INGREDIENT', position: 3, ingredientName: 'Feta', amount: 200, unit: 'g'},
            {
                contentId: 'g5',
                contentType: 'INGREDIENT',
                position: 4,
                ingredientName: 'Kalamata Oliven',
                amount: 100,
                unit: 'g'
            },
            {
                contentId: 'g6',
                contentType: 'INGREDIENT',
                position: 5,
                ingredientName: 'Olivenöl',
                amount: 4,
                unit: 'EL'
            },
            {
                contentId: 'g7',
                contentType: 'INGREDIENT',
                position: 6,
                ingredientName: 'Rotweinessig',
                amount: 2,
                unit: 'EL'
            },
            {
                contentId: 'g8',
                contentType: 'INGREDIENT',
                position: 7,
                ingredientName: 'Oregano getrocknet',
                amount: 1,
                unit: 'TL'
            },
        ],
    },
    {
        name: 'Banana Pancakes',
        recipeYield: 2,
        recipeInstructions: `## Zubereitung

1. Bananen mit einer Gabel zerdrücken
2. Eier hinzufügen und verrühren
3. Mehl, Backpulver und Zimt untermischen
4. Milch hinzufügen bis ein glatter Teig entsteht
5. Pfanne mit etwas Butter erhitzen
6. Kleine Portionen Teig in die Pfanne geben
7. Bei mittlerer Hitze goldbraun backen
8. Mit Ahornsirup und frischen Beeren servieren`,
        ingredientListContent: [
            {
                contentId: 'b1',
                contentType: 'INGREDIENT',
                position: 0,
                ingredientName: 'Reife Bananen',
                amount: 2,
                unit: 'Stück'
            },
            {contentId: 'b2', contentType: 'INGREDIENT', position: 1, ingredientName: 'Eier', amount: 2, unit: 'Stück'},
            {contentId: 'b3', contentType: 'INGREDIENT', position: 2, ingredientName: 'Mehl', amount: 100, unit: 'g'},
            {
                contentId: 'b4',
                contentType: 'INGREDIENT',
                position: 3,
                ingredientName: 'Backpulver',
                amount: 1,
                unit: 'TL'
            },
            {contentId: 'b5', contentType: 'INGREDIENT', position: 4, ingredientName: 'Milch', amount: 100, unit: 'ml'},
            {contentId: 'b6', contentType: 'INGREDIENT', position: 5, ingredientName: 'Zimt', amount: 0.5, unit: 'TL'},
            {contentId: 'b7', contentType: 'INGREDIENT', position: 6, ingredientName: 'Butter', amount: 20, unit: 'g'},
            {
                contentId: 'b8',
                contentType: 'INGREDIENT',
                position: 7,
                ingredientName: 'Ahornsirup',
                amount: 50,
                unit: 'ml'
            },
        ],
    },
];

async function seed() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Clear existing recipes
    const existingCount = await Recipe.countDocuments();
    if (existingCount > 0) {
        console.log(`Found ${existingCount} existing recipes. Clearing...`);
        await Recipe.deleteMany({});
    }

    // Insert test recipes
    console.log(`Inserting ${testRecipes.length} test recipes...`);
    for (const recipe of testRecipes) {
        const doc = new Recipe(recipe);
        await doc.save();
        console.log(`  ✓ ${recipe.name}`);
    }

    console.log('\nDone! Test data created successfully.');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('Error seeding data:', err);
    process.exit(1);
});
