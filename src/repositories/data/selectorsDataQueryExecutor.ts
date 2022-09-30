import continuousBreakdownQuery from "../../domain/queries/breakdown/continuousBreakdownQuery";
import timeBreakdownQuery from "../../domain/queries/breakdown/timeBreakdownQuery";
import countResourceQuery from "../../domain/queries/countResourceQuery";
import QueryDataResults from "../../domain/queries/queryDataResults";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Measures from "../../models/request/measures";
import Selector from "../../models/request/selector";
import fieldsDataQueryExecutor from "./fieldsDataQueryExecutor";

async function executeQueries(queryDataResults: QueryDataResults,
    selector: Selector,
    measures: Measures,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>): Promise<void> {

    await getTotalCount(queryDataResults, selector, filterTypes, fieldTypes);

    await getBreakdownResult(queryDataResults, selector, filterTypes, fieldTypes)

    await getFieldsDataQueryExecutor(queryDataResults, selector, measures, fieldTypes, filterTypes, selector)
}

async function getTotalCount(queryDataResults: QueryDataResults,selector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>){
    const countQuery = countResourceQuery.getQuery(selector, filterTypes, fieldTypes);
    console.warn(countQuery);

    const countResult = await aidboxProxy.executeQuery(countQuery) as any[];
    queryDataResults.addSelectorResult(selector, { query: countQuery, result: countResult[0] });
    return queryDataResults
}

async function getBreakdownResult(queryDataResults: QueryDataResults, selector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>){
    if(selector.breakdown){
        var breakdownQuery: string
        if(selector.breakdown.query){
            breakdownQuery = selector.breakdown.query
        }
        else{
            breakdownQuery = selector.breakdown.resource.fieldType == 'dateTime' ? 
            timeBreakdownQuery.getQuery(selector, filterTypes, fieldTypes) : continuousBreakdownQuery.getQuery(selector, filterTypes, fieldTypes);
        }
        console.warn(breakdownQuery);
        const breakdownResult = await aidboxProxy.executeQuery(breakdownQuery) as any[];

        queryDataResults.addSelectorBreakdownResult(selector, { query: breakdownQuery, result: breakdownResult });
    }
}

async function getFieldsDataQueryExecutor(
    queryDataResults: QueryDataResults,
    selector: Selector,
    measures: Measures,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>,
    topSelector: Selector) {

    if(selector.joins){
        await getFieldsDataQueryExecutor(queryDataResults, selector.joins, measures, fieldTypes, filterTypes, topSelector)
    }

    for (let fieldIndex = 0; fieldIndex < selector.fields.length; fieldIndex++) {
        const field = selector.fields[fieldIndex];
        await fieldsDataQueryExecutor.executeQueries(queryDataResults, topSelector, measures, field, fieldTypes, filterTypes);
    }
    
}

export default {
    executeQueries
}