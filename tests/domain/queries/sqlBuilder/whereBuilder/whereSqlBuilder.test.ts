import FieldInfo from "../../../../../src/models/fieldInfo";
import Filter from "../../../../../src/models/request/filter";
import whereSqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilder/whereBuilder/whereSqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('whereSqlBuilder tests', () => {
    const genderField = fieldObjectMother.get('gender');
    const addressCityField = fieldObjectMother.get('address.city');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const patientSelector = selectorObjectMother.get('Patient', [genderField, addressCityField], [femaleGenderFilter]);

    it('initialy has WHERE command', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = whereSqlBuilder.build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE");
    })

    it('can add fieldFilter to WHERE', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = whereSqlBuilder
            .fieldFilter()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE resource->>'gender' = 'female'");
    })

    it('can add fieldFilter with possible computed field WHERE', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();
        const ageField = fieldObjectMother.get('age');

        // ACT
        const sqlQuery = whereSqlBuilder
            .fieldFilter(ageField)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE resource->>'gender' = 'female' AND resource->>'birthDate' != 'null'");
    })

    it('can add subqueryFilter to WHERE', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = whereSqlBuilder
            .subqueryFilter('SQ')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE SQ.gender = 'female'");
    })

    it('can add groupBy to WHERE', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = whereSqlBuilder
            .fieldFilter()
            .groupBy()
            .field(genderField)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE resource->>'gender' = 'female' GROUP BY resource->>'gender'");
    })

    function getFieldsMap(fields: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
})