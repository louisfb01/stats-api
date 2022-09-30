SELECT 
    to_timestamp(floor((extract('epoch' from (location->'period'->>'start')::timestamp) / 1209600 )) * 1209600) AS period_start,
	count(*) AS count_in_period
FROM 
	Encounter encounter 
    CROSS JOIN LATERAL jsonb_array_elements(resource->'location') AS location  
WHERE 
	location->'location'->>'display' = 'intensive_care_unit' AND location->'period'->>'start' >= '2021-01-01' AND location->'period'->>'end' <= '2021-03-01'
GROUP BY
	period_start