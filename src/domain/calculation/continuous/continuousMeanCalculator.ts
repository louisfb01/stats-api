import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import ContinuousMeanResponse from "../../../models/response/continuousMeanResponse";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): ContinuousMeanResponse {

    const countResults = queryDataResults.getResult(selector, field, measure).result as any[];
    return {
        mean: countResults[0].mean,
        populationSize: countResults[0].count
    };
}

export default {
    calculate
}