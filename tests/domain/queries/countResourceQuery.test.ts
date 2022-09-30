import countResourceQuery from "../../../src/domain/queries/countResourceQuery";
import FieldInfo from "../../../src/models/fieldInfo";
import Filter from "../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../utils/objectMothers/models/fieldInfoObjectMother";
import filterObjectMother from "../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../src/domain/resourceArrayFields";

describe('countResourceQuery tests', () => {

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const joinSelector = selectorObjectMother.get('Patient', [], []);

    const filterMaps = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);


    it('gets query with resource from', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [], joinSelector);

        // ACT
        const query = countResourceQuery.getQuery(selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .countAll()
            .from()
            .resourceTable()
            .possibleJoin()
            .build(selector, filterMaps))
    })

    it('gets query with filters applied', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [femaleGenderFilter], joinSelector);

        // ACT
        const query = countResourceQuery.getQuery(selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .countAll()
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
        const query = countResourceQuery.getQuery(selector, filterMaps);

        // ASSERT
        expect(query).toEqual("SELECT count(*) FROM Patient patient_table "); // Space is added by possible join which has no impact
    })

    it('gets query with cross join and filters applied when one field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [femaleGenderFilter], joinSelector);

        resourceArrayFields.values = ['gender'];

        // ACT
        const query = countResourceQuery.getQuery(selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .countAll()
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