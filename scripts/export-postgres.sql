-- Export script for PostgreSQL data
-- Run this against the old PostgreSQL database to export recipes as JSON

-- Export all recipes with their ingredients
-- Run this query and save the output as recipes.json

SELECT json_agg(
               json_build_object(
                       'recipeId', r.recipe_id::text,
                       'name', r.name,
                       'recipeYield', r.recipe_yield,
                       'recipeInstructions', r.recipe_instructions,
                       'ingredientListContent', (SELECT COALESCE(json_agg(
                                                                         json_build_object(
                                                                                 'contentId', ilc.content_id::text,
                                                                                 'contentType', ilc.content_type,
                                                                                 'position', ilc.position,
                                                                                 'ingredientName', ilc.ingredient_name,
                                                                                 'unit', ilc.unit,
                                                                                 'amount', ilc.amount,
                                                                                 'sectionName', ilc.section_name
                                                                         ) ORDER BY ilc.position
                                                                 ), '[]'::json)
                                                 FROM ingredient_list_content ilc
                                                 WHERE ilc.recipe_id = r.recipe_id)
               )
       )
FROM recipe r;

-- Alternative: Export to file directly (PostgreSQL 9.3+)
-- \copy (SELECT ... query above ...) TO '/tmp/recipes.json'

-- Or using pg_dump for full backup:
-- pg_dump -U postgres -d weemeal --table=recipe --table=ingredient_list_content -F c -f backup.dump
