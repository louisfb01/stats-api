import timeBreakdownCalculator from "../../../../src/domain/calculation/breakdown/timeBreakdownCalculator";
import queryDataResultsObjectMother from "../../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother"
import breakdownObjectMother from "../../../utils/objectMothers/models/request/breakdownObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('timeBreakdownCalculator tests', () => {
    const field = fieldObjectMother.get('gender');


    it('with two results, time slices fit perfectly, gets count and start periods', () => {
        // ARRANGE
        const selector = getSelectorBreakdown(1209600, '2011-04-14', '2011-04-28')
        const queryResult = getQueryAndResult([
            { period_start: '2011-04-14T00:00:00Z', count_in_period: 6 },
            { period_start: '2011-04-28T00:00:00Z', count_in_period: 6 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorBreakdownResult(selector, queryResult);

        // ACT
        const breakdown = timeBreakdownCalculator.calculate(selector, queryDataResults);

        // ASSERT
        expect(breakdown.query).toEqual("SELECT * FROM Patient");

        expect(breakdown.result.length).toEqual(2)
        expect(breakdown.result[0]).toEqual({ periodStart: '2011-04-14T00:00:00Z', periodCount: 6 })
        expect(breakdown.result[1]).toEqual({ periodStart: '2011-04-28T00:00:00Z', periodCount: 6 })
    })

    it('with two results, results under six, count are null', () => {
        // ARRANGE
        const selector = getSelectorBreakdown(1209600, '2011-04-14', '2011-04-28')
        const queryResult = getQueryAndResult([
            { period_start: '2011-04-14T00:00:00Z', count_in_period: 5 },
            { period_start: '2011-04-28T00:00:00Z', count_in_period: 1 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorBreakdownResult(selector, queryResult);

        // ACT
        const breakdown = timeBreakdownCalculator.calculate(selector, queryDataResults);

        // ASSERT
        expect(breakdown.query).toEqual("SELECT * FROM Patient");

        expect(breakdown.result.length).toEqual(2)
        expect(breakdown.result[0]).toEqual({ periodStart: '2011-04-14T00:00:00Z', periodCount: 5 })
        expect(breakdown.result[1]).toEqual({ periodStart: '2011-04-28T00:00:00Z', periodCount: 1 })
    })

    it('with two results, time slices after first result, gets count and start periods', () => {
        // ARRANGE
        const selector = getSelectorBreakdown(1209600, '2011-04-15', '2011-04-28')
        const queryResult = getQueryAndResult([
            { period_start: '2011-04-14T00:00:00Z', count_in_period: 6 },
            { period_start: '2011-04-28T00:00:00Z', count_in_period: 6 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorBreakdownResult(selector, queryResult);

        // ACT
        const breakdown = timeBreakdownCalculator.calculate(selector, queryDataResults);

        // ASSERT
        expect(breakdown.query).toEqual("SELECT * FROM Patient");

        expect(breakdown.result.length).toEqual(2)
        expect(breakdown.result[0]).toEqual({ periodStart: '2011-04-14T00:00:00Z', periodCount: 6 })
        expect(breakdown.result[1]).toEqual({ periodStart: '2011-04-28T00:00:00Z', periodCount: 6 })
    })

    it('with one results, time slices after before first result, gets count and start periods and null for result in empty period', () => {
        // ARRANGE
        const selector = getSelectorBreakdown(1209600, '2011-04-15', '2011-04-28')
        const queryResult = getQueryAndResult([
            { period_start: '2011-04-28T00:00:00Z', count_in_period: 7 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorBreakdownResult(selector, queryResult);

        // ACT
        const breakdown = timeBreakdownCalculator.calculate(selector, queryDataResults);

        // ASSERT
        expect(breakdown.query).toEqual("SELECT * FROM Patient");

        expect(breakdown.result.length).toEqual(2)
        expect(breakdown.result[0]).toEqual({ periodStart: '2011-04-14T00:00:00Z', periodCount: 0 })
        expect(breakdown.result[1]).toEqual({ periodStart: '2011-04-28T00:00:00Z', periodCount: 7 })
    })

    it('with three results, time slice before and after results, whole between results, fills all holes', () => {
        // ARRANGE
        const selector = getSelectorBreakdown(86400, '2011-04-13', '2011-04-20')
        const queryResult = getQueryAndResult([
            { period_start: '2011-04-14T00:00:00Z', count_in_period: 7 },
            { period_start: '2011-04-16T00:00:00Z', count_in_period: 8 },
            { period_start: '2011-04-19T00:00:00Z', count_in_period: 9 }
        ]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorBreakdownResult(selector, queryResult);

        // ACT
        const breakdown = timeBreakdownCalculator.calculate(selector, queryDataResults);

        // ASSERT
        expect(breakdown.query).toEqual("SELECT * FROM Patient");

        expect(breakdown.result.length).toEqual(8)
        expect(breakdown.result[0]).toEqual({ periodStart: '2011-04-13T00:00:00Z', periodCount: 0 })
        expect(breakdown.result[1]).toEqual({ periodStart: '2011-04-14T00:00:00Z', periodCount: 7 })
        expect(breakdown.result[2]).toEqual({ periodStart: '2011-04-15T00:00:00Z', periodCount: 0 })
        expect(breakdown.result[3]).toEqual({ periodStart: '2011-04-16T00:00:00Z', periodCount: 8 })
        expect(breakdown.result[4]).toEqual({ periodStart: '2011-04-17T00:00:00Z', periodCount: 0 })
        expect(breakdown.result[5]).toEqual({ periodStart: '2011-04-18T00:00:00Z', periodCount: 0 })
        expect(breakdown.result[6]).toEqual({ periodStart: '2011-04-19T00:00:00Z', periodCount: 9 })
        expect(breakdown.result[7]).toEqual({ periodStart: '2011-04-20T00:00:00Z', periodCount: 0 })
    })

    function getSelectorBreakdown(step: number, min: string, max: string) {
        const breakdown = breakdownObjectMother.getWithMinMax('Patient', 'deceasedDate', step, min, max);
        return selectorObjectMother.get('Patient', [field], [], undefined, breakdown);
    }

    function getQueryAndResult(result: any) {
        return {
            query: "SELECT * FROM Patient",
            result
        }
    }
})