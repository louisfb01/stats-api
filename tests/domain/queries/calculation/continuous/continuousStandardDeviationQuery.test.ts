import FieldInfo from "../../../../../src/models/fieldInfo";
import Filter from "../../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import continuousQuery from "../../../../../src/domain/queries/calculation/continuous/continuousQuery";
import Field from "../../../../../src/models/request/field";
import ContinuousMesure from "../../../../../src/models/continuousMeasure";
import Measures from "../../../../../src/models/request/measures";

describe('continuousStandardDeviationQuery tests', () => {
    const ageField = fieldObjectMother.get('age');
    const genderField = fieldObjectMother.get('gender');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const filterMaps = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);

    const measures:Measures = {
        "continuous":[ContinuousMesure.stdev],
        "categorical":[]
    }

    beforeEach(() => {
        resourceArrayFields.values = []; // Simplify tests by not unwrapping json arrays.
    })

    it('With field and no filter, groups by field', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], []);
        const fieldTypes = new Map<Field, FieldInfo>();

        // ACT
        const query = continuousQuery.getQuery(selector, genderField, filterMaps, fieldTypes, measures);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .fieldStdDev(genderField, fieldTypes, selector)
            .from()
            .resourceTable()
            .crossJoinForArrayFilters(genderField)
            .possibleJoin()
            .build(selector, filterMaps))
    })

    it('With age computed field and no filter, groups by field with WHERE filter', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [ageField], []);
        const fieldTypes = new Map<Field, FieldInfo>();

        // ACT
        const query = continuousQuery.getQuery(selector, genderField, filterMaps, fieldTypes, measures);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .fieldStdDev(ageField, fieldTypes, selector)
            .from()
            .resourceTable()
            .crossJoinForArrayFilters(ageField)
            .possibleJoin()
            .where()
            .fieldFilter(ageField)
            .build(selector, filterMaps))
    })

    it('With field and filter, groups by field with WHERE filter', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], [femaleGenderFilter]);
        const fieldTypes = new Map<Field, FieldInfo>();

        // ACT
        const query = continuousQuery.getQuery(selector, genderField, filterMaps, fieldTypes, measures);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .fieldStdDev(genderField, fieldTypes, selector)
            .from()
            .resourceTable()
            .crossJoinForArrayFilters(genderField)
            .possibleJoin()
            .where()
            .fieldFilter()
            .build(selector, filterMaps))
    })

    function getFieldsMap(filters: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < filters.length; fieldIndex++) {
            fieldsMap.set(filters[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
})