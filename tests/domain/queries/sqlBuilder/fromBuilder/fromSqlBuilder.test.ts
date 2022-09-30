import FieldInfo from "../../../../../src/models/fieldInfo";
import Filter from "../../../../../src/models/request/filter";
import fromSqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/fromSqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";

describe('fromSqlBuilder tests', () => {
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const genderField = fieldObjectMother.get('gender');
    const addressCityField = fieldObjectMother.get('address.city');

    const genderFilter = filterObjectMother.get('gender', 'is', 'female');
    const cityFilter = filterObjectMother.get('address.city', 'is', 'Quebec');

    const patientSelector = selectorObjectMother.get('Patient', [genderField, addressCityField], [genderFilter]);

    it('initialy has FROM command', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder.build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM");
    })

    it('can add resourceTable to FROM', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder
            .resourceTable()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM Patient patient_table");
    })

    it('can add WHERE statement builder', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder
            .resourceTable()
            .where()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM Patient patient_table WHERE");
    })

    it('can add crossJoin to FROM', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField, addressCityField], [genderFilter, cityFilter])
        const filterTypes = getFiltersMap([genderFilter, cityFilter], [stringFieldInfo, stringFieldInfo]);
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        resourceArrayFields.values = ["address.city"];

        // ACT
        const sqlQuery = fromSqlBuilder
            .resourceTable()
            .crossJoinForArrayFilters()
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM Patient patient_table CROSS JOIN LATERAL jsonb_array_elements(resource->'address'->'city') AS address_city");
    })

    it('can add crossJoin with field to FROM', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField, addressCityField], [genderFilter])
        const filterTypes = getFiltersMap([genderFilter, cityFilter], [stringFieldInfo, stringFieldInfo]);
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        resourceArrayFields.values = ["address.city"];

        // ACT
        const sqlQuery = fromSqlBuilder
            .resourceTable()
            .crossJoinForArrayFilters(addressCityField)
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM Patient patient_table CROSS JOIN LATERAL jsonb_array_elements(resource->'address'->'city') AS address_city");
    })

    it('can add subquery to FROM', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], [])
        const filterTypes = getFiltersMap([genderFilter, cityFilter], [stringFieldInfo, stringFieldInfo]);
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        resourceArrayFields.values = ["address.city"];

        // ACT
        const sqlQuery = fromSqlBuilder
            .subquery(genderField, 'SQ')
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM (SELECT resource->>'gender' AS gender FROM Patient) AS SQ");
    })

    it('can add GROUP BY statement builder', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder
            .resourceTable()
            .groupBy()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM Patient patient_table GROUP BY");
    })

    it('can add possibleJoin statement builder', () => {
        // ARRANGE
        const joinSelector = selectorObjectMother.get('Patient', [], []);
        const innerJoinQuery = "SELECT id FROM Patient patient_table";
        const selector = selectorObjectMother.get('Observation', [], [], joinSelector);

        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder
            .possibleJoin()
            .build(selector, filterTypes);

        // ASSERT
        // Space is for potential join in join.
        const expectedQuery = `FROM JOIN (${innerJoinQuery} ) patient_table ON observation_table.resource->'subject'->>'id' = patient_table.id`;
        expect(sqlQuery).toEqual(expectedQuery);
    })

    function getFiltersMap(filters: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < filters.length; fieldIndex++) {
            fieldsMap.set(filters[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
})