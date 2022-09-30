SELECT
   count(*),
   STDDEV(extract(year from AGE(date(resource->>'birthDate')))) AS stddev,
   sqrt(count(*)) as count_sqr_root,
   AVG(extract(year from AGE(date(resource->>'birthDate')))) - (1.96 * (STDDEV(extract(year from AGE(date(resource->>'birthDate')))) / sqrt(count(*)))) as ci_low,
   AVG(extract(year from AGE(date(resource->>'birthDate')))) as mean,                                                                                                                                               
   AVG(extract(year from AGE(date(resource->>'birthDate')))) + (1.96 * (STDDEV(extract(year from AGE(date(resource->>'birthDate')))) / sqrt(count(*)))) as ci_high                                                             
FROM
   Patient patient_table 
WHERE
   resource->>'birthDate' != 'null' AND resource->>'deceasedBoolean' = 'true'