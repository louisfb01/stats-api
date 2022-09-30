import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import SummarizeResponse from "../../models/response/summarizeResponse";
import Selector from "../../models/request/selector";
import Measures from "../../models/request/measures";
import fieldReponseProcessor from "./fieldReponseProcessor";
import QueryDataResults from "../queries/queryDataResults";
import BreakdownResponse from "../../models/response/breakdownResponse";
import timeBreakdownCalculator from "./breakdown/timeBreakdownCalculator";
import FieldReponse from "../../models/response/fieldResponse";
import continuousBreakdownCalculator from "./breakdown/continuousBreakdownCalculator";

function getSummarizeReponse(selector: Selector,
    measures: Measures,
    queryDataResults: QueryDataResults,
    fieldTypes: Map<Field, FieldInfo>): SummarizeResponse {

    const countQueryAndResult = queryDataResults.getSelectorResult(selector);

    if (countQueryAndResult.result instanceof Error) {
        return { total: 0, error: countQueryAndResult.result, fieldResponses: [], query: '' };
    }

    const fieldResponses:FieldReponse[] = []; 

    getJoinFieldResponse(selector, measures, queryDataResults, fieldTypes, fieldResponses, selector)
    
    const resultBeforeBreakdown = {
        total: countQueryAndResult.result.count,
        fieldResponses,
        query: countQueryAndResult.query
    }

    if (!selector.breakdown) return resultBeforeBreakdown;

    if(selector.breakdown.resource.fieldType == "dateTime"){
        const breakdownResult = timeBreakdownCalculator.calculate(selector, queryDataResults);
        return { ...resultBeforeBreakdown, ...{ breakdown: breakdownResult } };
    }
    else{
        const breakdownResult = continuousBreakdownCalculator.calculate(selector, queryDataResults);
        return { ...resultBeforeBreakdown, ...{ breakdown: breakdownResult } };
    }
}

function getJoinFieldResponse(selector: Selector, 
    measures: Measures, 
    queryDataResults: QueryDataResults,
    fieldTypes: Map<Field, FieldInfo>,
    fieldResponses: FieldReponse[],
    topSelector: Selector)  {

    if(selector.joins){
        getJoinFieldResponse(selector.joins, measures, queryDataResults, fieldTypes, fieldResponses, topSelector)
    }

    selector.fields.filter(f => f.type!="dateTime").map(f => {
        fieldResponses.push(fieldReponseProcessor.getFieldReponse(topSelector, f, measures, queryDataResults, fieldTypes));
    });
}

export default {
    getSummarizeReponse
}