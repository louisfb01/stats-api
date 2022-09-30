SELECT DISTINCT
	jsonb_typeof(resource->'gender') as gender,
	jsonb_typeof(jsonb_array_elements(resource->'address')->'country') as country 
FROM 
	Patient;