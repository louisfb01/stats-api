import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): number | Error{
    const countResults = queryDataResults.getResult(selector, field, measure);
    if(countResults instanceof Error){
        return countResults
    }
    return countResults.result[0].stddev;
}

export default {
    calculate
}