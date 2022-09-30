-- First level array
SELECT DISTINCT
    jsonb_typeof(jsonb_array_elements(resource->'address')->'country') as address_country
FROM Patient

-- Second level array when child field is flat
SELECT DISTINCT
    jsonb_typeof(jsonb_array_elements(jsonb_array_elements(resource->'name')->'given')) as name_family
FROM Patient