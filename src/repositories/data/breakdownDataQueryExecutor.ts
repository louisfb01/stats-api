import continuousBreakdownQuery from "../../domain/queries/breakdown/continuousBreakdownQuery";
import timeBreakdownQuery from "../../domain/queries/breakdown/timeBreakdownQuery";
import QueryDataResults from "../../domain/queries/queryDataResults";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";

async function executeQueries(queryDataResults: QueryDataResults,
    selector: Selector,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>): Promise<void> {

    await getBreakdownResult(queryDataResults, selector, filterTypes, fieldTypes)

}

async function getBreakdownResult(queryDataResults: QueryDataResults, selector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>) {
    if (selector.breakdown) {
        var breakdownQuery: string
        if (selector.breakdown.query) {
            breakdownQuery = selector.breakdown.query
        }
        else {
            breakdownQuery = selector.breakdown.resource.fieldType == 'dateTime' ?
                timeBreakdownQuery.getQuery(selector, filterTypes, fieldTypes) : continuousBreakdownQuery.getQuery(selector, filterTypes, fieldTypes);
        }
        console.warn(breakdownQuery);
        const breakdownResult = await aidboxProxy.executeQuery(breakdownQuery) as any[];

        queryDataResults.addSelectorBreakdownResult(selector, { query: breakdownQuery, result: breakdownResult });
    }
}

export default {
    executeQueries
}