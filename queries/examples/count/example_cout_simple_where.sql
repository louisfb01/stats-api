SELECT 
	count(*) AS count 
FROM  
	Patient
WHERE 
	resource->>'gender' = 'female'; 