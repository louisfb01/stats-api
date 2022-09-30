SELECT
	SQ.period_start as period_start,
	count(*) AS count_in_period 
FROM 
  (SELECT 
      DISTINCT resource->'subject'->>'reference' as subject_reference,
      to_timestamp(floor((extract('epoch' from (location->'period'->>'start')::timestamp) / 86400)) * 86400) AS period_start
  FROM
      Encounter encounter_table
      CROSS JOIN
        LATERAL jsonb_array_elements(resource -> 'location') AS location 
      JOIN
        (
           SELECT
              id 
           FROM
              Location location_table 
              CROSS JOIN
                 LATERAL jsonb_array_elements(resource -> 'type') AS type 
              CROSS JOIN
                 LATERAL jsonb_array_elements(type -> 'coding') AS type_coding 
           WHERE
              type_coding ->> 'code' = 'HU'
        )
        location_table
        CROSS JOIN
          LATERAL jsonb_array_elements(encounter_table.resource -> 'location') AS location_location 
          ON location_location -> 'location' ->> 'reference' = 'Location/' || location_table.id 	
  WHERE
     location -> 'period'->>'start'>='2021-01-01' AND location->'period'->>'start'<'2021-04-06') SQ
GROUP BY
   period_start