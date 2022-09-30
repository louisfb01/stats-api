import groupCountQuery from "../../../../../src/domain/queries/calculation/discrete/groupCountQuery";
import FieldInfo from "../../../../../src/models/fieldInfo";
import Filter from "../../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";

describe('groupCountQuery tests', () => {
    const genderField = fieldObjectMother.get('gender');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const filterMaps = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);

    beforeEach(() => {
        resourceArrayFields.values = []; // Simplify tests by not unwrapping json arrays.
    })

    it('With field and no filter, groups by field', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], []);

        // ACT
        const query = groupCountQuery.getQuery(selector, genderField, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .field(genderField)
            .comma()
            .countField(genderField, selector)
            .from()
            .resourceTable()
            .crossJoinForArrayFilters(genderField)
            .possibleJoin()
            .groupBy()
            .field(genderField)
            .build(selector, filterMaps))
    })

    it('With field and filter, groups by field with WHERE filter', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], [femaleGenderFilter]);

        // ACT
        const query = groupCountQuery.getQuery(selector, genderField, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .field(genderField)
            .comma()
            .countField(genderField, selector)
            .from()
            .resourceTable()
            .crossJoinForArrayFilters(genderField)
            .possibleJoin()
            .where()
            .fieldFilter()
            .groupBy()
            .field(genderField)
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