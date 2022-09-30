SELECT 
	count(*) AS count 
FROM  
	Observation obs
    JOIN (SELECT id FROM Patient WHERE resource->>'gender' = 'female') pat
    	ON obs.resource->'subject'->>'id' = pat.id
WHERE
	obs.resource->'value'->'Quantity'->>'value' = '145.23'; 