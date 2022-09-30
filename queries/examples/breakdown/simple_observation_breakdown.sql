SELECT 
    to_timestamp(floor((extract('epoch' from (resource->>'issued')::timestamp) / 1209600 )) * 1209600) AS period_start,
	count(*) AS count_in_period
FROM 
	Observation observation 
    CROSS JOIN LATERAL jsonb_array_elements(resource->'code'->'coding') AS code_coding  
WHERE 
	code_coding->>'display' = 'positive' AND resource->>'issued' >= '2021-01-01' AND resource->>'issued' <= '2021-03-01'
GROUP BY
	period_start