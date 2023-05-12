import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): number[] | Error{

    const ciResults = queryDataResults.getResult(selector, field, measure);
    if(ciResults instanceof Error){
        return ciResults
    }
    return [
        ciResults.result[0].ci_low,
        ciResults.result[0].ci_high
    ];
}

export default {
    calculate
}