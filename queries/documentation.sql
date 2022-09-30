SQL Request definition:

SELECT
	- field									-> Field to select or count
		o count(*)							-> Total resource count
		o (sub_query).field					-> Get field value
		o count((sub_query).field)			-> Get total group of field values
FROM
	- TABLE									-> Resource to query 
	- CROSS JOIN LATERAL					-> When filter field is array used to unroll field for WHERE clause
	- JOIN									-> When mapping patiend ids for Observation resource query
	- INNER TABLE SELECT					-> Used for field selection of GROUP BY clause

WHERE (Optional)
	-filter									-> Filter to apply to gather calculation data
		o resource->>'field' (op) (value)	-> Field to filter from value and operation comparator
		o cross_join_field (op) (value)		-> Field prepared in cross join because of array
		o (sub_query).field (op) (value)	-> Fild prepared in inner table select
	- AND									-> Combined filters
GROUP BY
	- (sub_query).field						-> Field to group and count data

Examples:

(Total Resource count)

a) No filter, no fields

SELECT 
	count(*) AS count 
FROM  
	Patient; 

b) Female gender filter, no fields

SELECT 
	count(*) AS count 
FROM  
	Patient
WHERE 
	resource->>'gender' = 'female'; 

c) Female gender filter, Quebec address.city filter (array), no fields

SELECT 
	count(*) AS count 
FROM  
	Patient 
    CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address, jsonb_array_elements(resource->'name') AS resource_name
WHERE 
	resource->>'gender' = 'male' AND address->>'city' = 'Quebec' AND resource_name->>'family' = 'Drolet'; 

d) Positive interpretation.coding.display filter and after yesterday filter, no fields

SELECT 
	count(*) 
FROM 
	Observation 
	CROSS JOIN LATERAL jsonb_array_elements(resource->'interpretation') AS interpretation 
    CROSS JOIN LATERAL jsonb_array_elements(interpretation->'coding') AS interpretation_coding 
WHERE 
	interpretation_coding->>'display' = 'positive' AND resource->>'effectiveDateTime' >= '2021-02-25'

e) (Subquery: female gender filter on Patient), 145 value fitler, no fields

SELECT 
	count(*) AS count 
FROM  
	Observation observation
    JOIN (SELECT id FROM Patient WHERE resource->>'gender' = 'female') patient
    	ON observation.resource->'subject'->>'id' = patient.id
WHERE
	resource->'value'->'Quantity'->>'value' = '154.4'; 


f) (Subquery: Quebec address.city filter (array) on Patient), cm value.Quantity.unit fitler, no fields

SELECT 
	count(*) AS count 
FROM  
	Observation observation
    JOIN (SELECT 
        id
    FROM 
        Patient
        CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address 
    WHERE
        address->>'city' = 'Quebec') patient
    ON 
    	observation.resource->'subject'->>'id' = patient.id
WHERE
	resource->'value'->'Quantity'->>'unit' = 'cm'

g) (Subquery: over 100 value.Quantity.value filter on Observation), female gender filter, no fields

SELECT 
	count(*) AS count  
FROM 
	Patient patient 
	JOIN (SELECT 
		resource->'subject'->>'id' AS subject_id 
	FROM 
		Observation observation 
	WHERE 
		resource->'value'->'Quantity'->>'value' > '100') observation 
	ON 
		patient.id = observation.subject_id
WHERE resource->>'gender' = 'female'

h) Real query on site -> (Subquery: after yesterday effectiveDateTime filter on Observation), female gender filter, no fields

SELECT 
	count(*) AS count  
FROM 
	Patient patient 
	JOIN (SELECT 
		resource->'subject'->>'reference' AS subject_reference 
	FROM 
		Observation observation 
	WHERE 
		resource->>'effectiveDateTime' > '2021-03-25') observation 
	ON 
		'Patient/' || patient.id = observation.subject_reference 
WHERE resource->>'gender' = 'female'

=========================================
(Categorical count)

a) No filter, gender field

SELECT 
    SQ.gender AS gender, 
    count(SQ.gender) AS count 
FROM 
    (SELECT resource->>'gender' AS gender FROM Patient) AS SQ
GROUP BY SQ.gender

b) No filter, address.country field (array)

SELECT 
	address_country AS address_country, 
	count(SQ.address_country) AS count 
FROM 
    (SELECT jsonb_array_elements(resource->'address')->>'country' AS address_country FROM Patient) AS SQ
GROUP BY SQ.address_country


c) male gender filter, gender field

SELECT 
    SQ.gender AS gender, 
    count(SQ.gender) AS count 
FROM 
    (SELECT resource->>'gender' AS gender FROM Patient) AS SQ
WHERE
	SQ.gender='male'
GROUP BY SQ.gender

d) male gender filter and Quebec city filter (array), gender field

SELECT 
    SQ.gender AS gender, 
    count(SQ.gender) AS count 
FROM 
    (SELECT resource->>'gender' AS gender, jsonb_array_elements(resource->'address')->>'city' AS address_city FROM Patient) AS SQ
WHERE
	SQ.gender='male' AND SQ.address_city = 'Quebec'
GROUP BY SQ.gender

e) positive interpretation.coding.display fielder, code.text field

SELECT 
    SQ.code_text AS code_text, 
    count(SQ.code_text) AS count 
FROM 
    (SELECT resource->'code'->'text' AS code_text, jsonb_array_elements(jsonb_array_elements(resource->'interpretation')->'coding')->>'display' AS interpretation_coding_display FROM Observation) AS SQ
WHERE
	SQ.interpretation_coding_display='positive'
GROUP BY SQ.code_text

e) (Subquery: female gender filter on Patient), quantity.value filter, quantity.value field

SELECT 
    SQ.value_quantity AS value_quantity, 
    count(SQ.value_quantity) AS count 
FROM 
    (SELECT resource->'value'->'Quantity'->>'value' AS value_quantity, resource->'subject'->>'id' AS subject_id FROM Observation) AS SQ
    JOIN (SELECT id FROM Patient WHERE resource->>'gender' = 'female') pat
    	ON SQ.subject_id = pat.id
WHERE
	SQ.value_quantity = '145.23'
GROUP BY SQ.value_quantity