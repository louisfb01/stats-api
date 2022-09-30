import joinInnerQueryBuilder from "../../../../../../src/domain/queries/sqlBuilder/fromBuilder/join/joinInnerQueryBuilder";
import resourceArrayFields from "../../../../../../src/domain/resourceArrayFields";
import FieldInfo from "../../../../../../src/models/fieldInfo";
import Filter from "../../../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../../utils/objectMothers/models/fieldInfoObjectMother";
import filterObjectMother from "../../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('joinInnerBuilder tests', () => {
    const parentSelector = selectorObjectMother.get('Observation', [], []);
    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const filterMaps = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);


    it('gets query with resource from', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], []);

        // ACT
        const query = joinInnerQueryBuilder.build(parentSelector, selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .joinId(parentSelector)
            .from()
            .resourceTable()
            .possibleJoin()
            .build(selector, filterMaps))
    })

    it('gets query with resource from with inner join', () => {
        // ARRANGE
        const joinSelector = selectorObjectMother.get('Observation', [], []);
        const selector = selectorObjectMother.get('Patient', [], [], joinSelector);

        // ACT
        const query = joinInnerQueryBuilder.build(parentSelector, selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .joinId(parentSelector)
            .from()
            .resourceTable()
            .possibleJoin()
            .build(selector, filterMaps))
    })

    it('gets query with filters applied', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [femaleGenderFilter]);

        // ACT
        const query = joinInnerQueryBuilder.build(parentSelector, selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .joinId(parentSelector)
            .from()
            .resourceTable()
            .possibleJoin()
            .where()
            .fieldFilter()
            .build(selector, filterMaps))
    })

    it('escapes resource to avoid sql injections', () => {
        // ARRANGE
        const selector = selectorObjectMother.get("Patient'--drop", [], []);

        // ACT
        const query = joinInnerQueryBuilder.build(parentSelector, selector, filterMaps);

        // ASSERT
        expect(query).toEqual("SELECT id FROM Patient patient_table ") // Space is for potential inner join
    })

    it('gets query with cross join and filters applied when one field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [femaleGenderFilter]);

        resourceArrayFields.values = ['gender'];

        // ACT
        const query = joinInnerQueryBuilder.build(parentSelector, selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .joinId(parentSelector)
            .from()
            .resourceTable()
            .crossJoinForArrayFilters()
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