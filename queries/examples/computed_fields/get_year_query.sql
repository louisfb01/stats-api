SELECT
    extract(year from AGE(date(resource->>'birthDate'))) as age
FROM
	Patient
WHERE
    resource->>'birthDate' != 'null'         
LIMIT 100