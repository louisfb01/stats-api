import selectBreakdownPeriodStartBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectBreakdownPeriodStartBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import breakdownObjectMother from "../../../../utils/objectMothers/models/request/breakdownObjectMother";

describe('selectBreakdownPeriodStartBuilder tests', () => {
    const queryPattern = (fieldCompiled: string, step: number) => {
        return `to_timestamp(floor((extract('epoch' from (${fieldCompiled})::timestamp) / ${step} )) * ${step}) AS period_start`
    }

    it('with non array field, field is selected from resource', () => {
        // ARRANGE
        const breakdown = breakdownObjectMother.get('Observation', 'issued', 1209600);

        // ACT
        const result = selectBreakdownPeriodStartBuilder.build(breakdown);

        // ASSERT
        expect(result).toEqual(queryPattern("resource->>'issued'", 1209600))
    })

    it('with array field, field is selected from name convention', () => {
        // ARRANGE
        const breakdown = breakdownObjectMother.get('Encounter', 'location.period.start', 1209600);

        resourceArrayFields.values = ['location'];


        // ACT
        const result = selectBreakdownPeriodStartBuilder.build(breakdown);

        // ASSERT
        expect(result).toEqual(queryPattern("location->'period'->>'start'", 1209600))
    })
})