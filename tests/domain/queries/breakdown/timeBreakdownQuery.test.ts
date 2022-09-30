import timeBreakdownQuery from "../../../../src/domain/queries/breakdown/timeBreakdownQuery";
import countResourceQuery from "../../../../src/domain/queries/countResourceQuery";
import resourceArrayFields from "../../../../src/domain/resourceArrayFields";
import FieldInfo from "../../../../src/models/fieldInfo";
import Filter from "../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../utils/objectMothers/models/fieldInfoObjectMother";
import filterObjectMother from "../../../utils/objectMothers/models/filterObjectMother";
import breakdownObjectMother from "../../../utils/objectMothers/models/request/breakdownObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('timeBreakdownQuery tests', () => {

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');
    const stringFieldInfo = fieldInfoObjectMother.get('string');
    const deceasedDateBreakdown = breakdownObjectMother.get('Patient', 'deceasedDate', 60);

    const filterMaps = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);

    beforeEach(() => {
        resourceArrayFields.values = [];

    })


    it('gets query with resource from', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [], undefined, deceasedDateBreakdown);

        // ACT
        const query = timeBreakdownQuery.getQuery(selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .breakdownPeriodStart()
            .comma()
            .namedCountAll('count_in_period')
            .from()
            .resourceTable()
            .possibleJoin()
            .groupBy()
            .compiledField('period_start')
            .build(selector, filterMaps));
    })

    it('gets query with filters applied', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [femaleGenderFilter], undefined, deceasedDateBreakdown);

        // ACT
        const query = timeBreakdownQuery.getQuery(selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .breakdownPeriodStart()
            .comma()
            .namedCountAll('count_in_period')
            .from()
            .resourceTable()
            .possibleJoin()
            .where()
            .fieldFilter()
            .groupBy()
            .compiledField('period_start')
            .build(selector, filterMaps));
    })

    it('gets query with cross join and filters applied when one field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [femaleGenderFilter], undefined, deceasedDateBreakdown);

        resourceArrayFields.values = ['gender'];

        // ACT
        const query = timeBreakdownQuery.getQuery(selector, filterMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .breakdownPeriodStart()
            .comma()
            .namedCountAll('count_in_period')
            .from()
            .resourceTable()
            .crossJoinForArrayFilters()
            .possibleJoin()
            .where()
            .fieldFilter()
            .groupBy()
            .compiledField('period_start')
            .build(selector, filterMaps));
    })

    function getFieldsMap(filters: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < filters.length; fieldIndex++) {
            fieldsMap.set(filters[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
})