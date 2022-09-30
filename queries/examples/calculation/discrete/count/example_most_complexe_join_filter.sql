SELECT
   resource->>'deceasedBoolean' as deceased_boolean,
   count(resource->>'deceasedBoolean') 
FROM
   Patient patient_table 
   JOIN
      (
         SELECT
            resource -> 'subject' ->> 'reference' AS subject_reference 
         FROM
            Observation observation_table 
            CROSS JOIN
               LATERAL jsonb_array_elements(resource -> 'code' -> 'coding') AS code_coding 
         WHERE
            code_coding ->> 'code' = '94500-6'
      )
      observation_table 
      ON 'Patient/' || patient_table.id = observation_table.subject_reference 
GROUP BY
   resource->>'deceasedBoolean'