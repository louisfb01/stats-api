SELECT
   count(*),
   SUM(extract(year from AGE(date(resource->>'birthDate')))) as sum,
   percentile_disc(0.05) within group (order by extract(year from AGE(date(resource->>'birthDate')))) AS ci_low,
   percentile_disc(0.5) within group (order by extract(year from AGE(date(resource->>'birthDate')))) AS mean,
   percentile_disc(0.95) within group (order by extract(year from AGE(date(resource->>'birthDate')))) AS ci_high                                                                      
FROM
   Patient patient_table 
WHERE
   resource ->> 'birthDate' != 'null'