SELECT
   SUM(extract(year from AGE(date(resource ->> 'birthDate')))) AS sum,
   percentile_disc(0.5) within group (order by extract(year from AGE(date(resource ->> 'birthDate')))) AS mean
FROM
   Patient patient_table 
WHERE
   resource ->> 'birthDate' != 'null'