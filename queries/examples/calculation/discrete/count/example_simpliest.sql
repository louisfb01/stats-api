SELECT 
    SQ.gender AS gender, 
    count(SQ.gender) AS count 
FROM 
    (SELECT resource->>'gender' as gender FROM Patient) AS SQ
GROUP BY SQ.gender