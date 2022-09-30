import CategoricalMesure from "../../models/categoricalMeasure";
import ContinuousMesure from "../../models/continuousMeasure";
import Field from "../../models/request/field";
import Selector from "../../models/request/selector";
import QueryDataResults from "../queries/queryDataResults";

export default interface FieldMetricCalculator {
    metric: ContinuousMesure | CategoricalMesure,
    metricCalculation: (selector: Selector, queryDataResults: QueryDataResults, field: Field,
        measure: ContinuousMesure | CategoricalMesure) => any
}