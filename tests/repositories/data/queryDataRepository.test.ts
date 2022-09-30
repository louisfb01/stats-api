import FieldInfo from "../../../src/models/fieldInfo";
import Field from "../../../src/models/request/field";
import selectorsDataQueryExecutor from "../../../src/repositories/data/selectorsDataQueryExecutor";
import summarizeDataQueryExecutor from "../../../src/repositories/data/queryDataRepository";
import measuresObjectMother from "../../utils/objectMothers/models/request/measuresObjectMother";
import summarizeRequestBodyObjectMother from "../../utils/objectMothers/models/request/summarizeRequestBodyObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";
import Filter from "../../../src/models/request/filter";

describe('summarizeDataQueryExecutor tests', () => {
    const measures = measuresObjectMother.getAllOptionMeasures();
    const fieldMaps = new Map<Field, FieldInfo>();
    const filterMaps = new Map<Filter, FieldInfo>();

    beforeEach(() => {
        selectorsDataQueryExecutor.executeQueries = jest.fn();
    })

    it('Processes each requests for selectors', async () => {
        // ARRANGE
        const selectorA = selectorObjectMother.get('Patient', [], []);
        const selectorB = selectorObjectMother.get('Observation', [], []);

        const request = summarizeRequestBodyObjectMother.get([selectorA, selectorB], { measures });

        // ACT
        const queryDataResults = await summarizeDataQueryExecutor.executeQueries(request, fieldMaps, filterMaps);

        // ASSERT
        expect(selectorsDataQueryExecutor.executeQueries).toHaveBeenCalledWith(queryDataResults, selectorA, measures, fieldMaps, filterMaps);
        expect(selectorsDataQueryExecutor.executeQueries).toHaveBeenCalledWith(queryDataResults, selectorB, measures, fieldMaps, filterMaps);
    })
})