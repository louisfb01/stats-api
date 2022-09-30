SELECT 
	country AS country, 
	count(SQ.country) AS count 
FROM 
    (SELECT jsonb_array_elements(resource->'address')->>'country' as country FROM Patient) AS SQ
GROUP BY SQ.country