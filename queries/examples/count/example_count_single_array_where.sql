SELECT 
	count(*) AS count 
FROM  
	Patient 
    CROSS JOIN LATERAL jsonb_array_elements(resource->'address') as address, jsonb_array_elements(resource->'name') as resource_name
WHERE 
	resource->>'gender' = 'female' AND address->>'city' = 'Quebec' AND resource_name->>'family' = 'Drolet'; 