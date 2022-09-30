import FieldInfo from "../../../../../src/models/fieldInfo";
import Field from "../../../../../src/models/request/field";
import Filter from "../../../../../src/models/request/filter";
import selectBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilder/selectBuilder/selectSqlBuilderObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import breakdownObjectMother from "../../../../utils/objectMothers/models/request/breakdownObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('SelectSqlBuilder tests', () => {
    const genderField = fieldObjectMother.get('gender');
    const addressCityField = fieldObjectMother.get('address.city');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');

    const patientSelector = selectorObjectMother.get('Patient', [genderField, addressCityField], [femaleGenderFilter]);
    const observationSelector = selectorObjectMother.get('Observation', [genderField, addressCityField], [femaleGenderFilter]);

    it('initialy has SELECT command', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder.build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT");
    })

    it('can add distinct to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .distinct()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT DISTINCT");
    })

    it('can add join id to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .joinId(observationSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT id");
    })

    it('can add fieldTypes to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        const selector = selectorObjectMother.get('Patient', [field], []);

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldTypes()
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT jsonb_typeof(resource->'gender') AS gender");
    })

    it('can add filterTypes to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const filter = filterObjectMother.get('gender', 'is', 'male');

        const selector = selectorObjectMother.get('Patient', [], [filter]);

        // ACT
        const sqlQuery = selectSqlBuilder
            .filterTypes()
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT jsonb_typeof(resource->'gender') AS gender");
    })

    it('can add countAll to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .countAll()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(*)");
    })

    it('can add field to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .field(field)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT resource->>'gender' AS gender");
    })

    it('can add subqueryField to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .subqueryField(field, 'SQ')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT SQ.gender");
    })

    it('can add countField to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .countField(field, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(resource->>'gender')");
    })

    it('can add countSubqueryField to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .countSubqueryField(field, 'SQ')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(SQ.gender)");
    })

    it('can add fieldSum to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fieldTypes = new Map<Field, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldSum(field, fieldTypes, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT SUM(resource->>'gender') AS sum");
    })

    it('can add fieldMean to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fieldTypes = new Map<Field, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldMean(field, fieldTypes, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT AVG(resource->>'gender') AS mean");
    })

    it('can add fieldStdDev to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fieldTypes = new Map<Field, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldStdDev(field, fieldTypes, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT STDDEV(resource->>'gender') AS stddev");
    })

    it('can add fieldCiLow to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldCiLow(field, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT percentile_disc(0.05) within group (order by resource->>'gender') AS ci_low");
    })

    it('can add fieldCiHigh to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldCiHigh(field, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT percentile_disc(0.95) within group (order by resource->>'gender') AS ci_high");
    })

    it('can add namedCountAll to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .namedCountAll('count_in_period')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(*) AS count_in_period");
    })

    it('can add comma to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender');

        // ACT
        const sqlQuery = selectSqlBuilder
            .countAll()
            .comma()
            .countSubqueryField(field, 'SQ')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(*) , count(SQ.gender)");
    })

    it('can add breakdownPeriodStart to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        const breakdown = breakdownObjectMother.get('Observation', 'issued', 1209600);
        const selector = selectorObjectMother.get('Observation', [], [], undefined, breakdown);

        const queryPattern = (fieldCompiled: string, step: number) => {
            return `SELECT to_timestamp(floor((extract('epoch' from (${fieldCompiled})::timestamp) / ${step} )) * ${step}) AS period_start`
        }

        // ACT
        const sqlQuery = selectSqlBuilder
            .breakdownPeriodStart()
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual(queryPattern("resource->>'issued'", 1209600));
    })

    it('can add FROM statement builder', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .countAll()
            .from()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(*) FROM");
    })
})