SELECT 
    SQ.gender AS gender, 
    count(SQ.gender) AS count 
FROM 
    (SELECT resource->>'gender' as gender, jsonb_array_elements(resource->'address')->>'city' as address_city FROM Patient) AS SQ
WHERE
	SQ.gender='male' AND address_city = 'Quebec'
GROUP BY SQ.gender