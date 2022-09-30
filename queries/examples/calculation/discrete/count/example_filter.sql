SELECT 
    SQ.gender AS gender, 
    count(SQ.gender) AS count 
FROM 
    (SELECT resource->>'gender' as gender FROM Patient) AS SQ
WHERE
	SQ.gender='male'
GROUP BY SQ.gender