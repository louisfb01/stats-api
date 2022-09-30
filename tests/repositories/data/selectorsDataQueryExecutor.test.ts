import { when } from "jest-when";
import timeBreakdownQuery from "../../../src/domain/queries/breakdown/timeBreakdownQuery";
import countResourceQuery from "../../../src/domain/queries/countResourceQuery";
import aidboxProxy from "../../../src/infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../../src/models/fieldInfo";
import Field from "../../../src/models/request/field";
import Filter from "../../../src/models/request/filter";
import fieldsDataQueryExecutor from "../../../src/repositories/data/fieldsDataQueryExecutor";
import selectorsDataQueryExecutor from "../../../src/repositories/data/selectorsDataQueryExecutor";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother"
import breakdownObjectMother from "../../utils/objectMothers/models/request/breakdownObjectMother";
import measuresObjectMother from "../../utils/objectMothers/models/request/measuresObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('selectorsDataQueryExecutor tests', () => {
    const measures = measuresObjectMother.getAllOptionMeasures();
    const fieldMaps = new Map<Field, FieldInfo>();
    const filterMaps = new Map<Filter, FieldInfo>();

    const countQuery = "SELECT count(*) from Patient";
    const countResult = { count: 45 }
    const queryAndResult = { query: countQuery, result: countResult };

    const breakdownQuery = "SELECT count(*) AS count_breakdown from Patient";
    const breakdownResult = { count: 54 }


    beforeEach(() => {
        fieldsDataQueryExecutor.executeQueries = jest.fn();
        aidboxProxy.executeQuery = jest.fn();
        countResourceQuery.getQuery = jest.fn();
        timeBreakdownQuery.getQuery = jest.fn();
    })

    it('gets the total count for resource', async () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], []);

        when(countResourceQuery.getQuery as any)
            .calledWith(selector, filterMaps)
            .mockReturnValue(countQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(countQuery)
            .mockReturnValue([countResult]); // Array important because sql results yield row returns.

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldMaps, filterMaps);

        // ASSERT
        const totalResult = queryDataResults.getSelectorResult(selector);
        expect(totalResult).toEqual({ query: countQuery, result: countResult });
    })

    it('with breakdown, gets the breakdown for resource', async () => {
        // ARRANGE
        const breakdown = breakdownObjectMother.get('Patient', 'deceasedTime', 60);
        const selector = selectorObjectMother.get('Patient', [], [], undefined, breakdown);

        when(countResourceQuery.getQuery as any)
            .calledWith(selector, filterMaps)
            .mockReturnValue(countQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(countQuery)
            .mockReturnValue([countResult]); // Array important because sql results yield row returns.

        when(timeBreakdownQuery.getQuery as any)
            .calledWith(selector, filterMaps)
            .mockReturnValue(breakdownQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(breakdownQuery)
            .mockReturnValue([breakdownResult]); // Array important because sql results yield row returns.

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldMaps, filterMaps);

        // ASSERT
        const selectorBreakdownResult = queryDataResults.getSelectorBreakdownResult(selector);
        expect(selectorBreakdownResult).toEqual({ query: breakdownQuery, result: [breakdownResult] });
    })

    it('with breakdown, breakdown has its own query, gets the breakdown from query', async () => {
        // ARRANGE
        const breakdown = breakdownObjectMother.get('Patient', 'deceasedTime', 60, breakdownQuery);
        const selector = selectorObjectMother.get('Patient', [], [], undefined, breakdown);

        when(countResourceQuery.getQuery as any)
            .calledWith(selector, filterMaps)
            .mockReturnValue(countQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(countQuery)
            .mockReturnValue([countResult]); // Array important because sql results yield row returns.

        when(aidboxProxy.executeQuery as any)
            .calledWith(breakdownQuery)
            .mockReturnValue([breakdownResult]); // Array important because sql results yield row returns.

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldMaps, filterMaps);

        // ASSERT
        const selectorBreakdownResult = queryDataResults.getSelectorBreakdownResult(selector);
        expect(selectorBreakdownResult).toEqual({ query: breakdownQuery, result: [breakdownResult] });
    })

    it('with two fields in selector, field queries are executed', async () => {
        // ARRANGE
        const fieldA = fieldObjectMother.get('fieldA');
        const fieldB = fieldObjectMother.get('fieldB');

        const selector = selectorObjectMother.get('Patient', [fieldA, fieldB], []);

        when(countResourceQuery.getQuery as any)
            .calledWith(selector, filterMaps)
            .mockReturnValue(countQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(countQuery)
            .mockReturnValue([countResult]); // Array important because sql results yield row returns.

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldMaps, filterMaps);

        // ASSERT
        expect(fieldsDataQueryExecutor.executeQueries).toBeCalledWith(queryDataResults, selector, measures, fieldA, fieldMaps, filterMaps);
        expect(fieldsDataQueryExecutor.executeQueries).toBeCalledWith(queryDataResults, selector, measures, fieldB, fieldMaps, filterMaps);
    })
})