import constants from "../../constants";
import QueryDataResults from "../../domain/queries/queryDataResults";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Measures from "../../models/request/measures";
import Selector from "../../models/request/selector";
import fieldsMeasureDataQueryExecutor from "./fieldsMeasureDataQueryExecutor";

async function executeContinuousMetrics(queryDataResults: QueryDataResults,
    selector: Selector,
    measures: Measures,
    field: Field,
    fieldTypes: Map<Field, FieldInfo>,
    filterFieldTypes: Map<Filter, FieldInfo>) {

    await fieldsMeasureDataQueryExecutor.exectuteQuery(queryDataResults, selector, field, measures, fieldTypes, filterFieldTypes);
}

async function executeCategoricalMetrics(queryDataResults: QueryDataResults,
    selector: Selector,
    measures: Measures,
    field: Field,
    fieldTypes: Map<Field, FieldInfo>,
    filterFieldTypes: Map<Filter, FieldInfo>) {

    await fieldsMeasureDataQueryExecutor.exectuteQuery(queryDataResults, selector, field, measures, fieldTypes, filterFieldTypes);
}

async function executeQueries(queryDataResults: QueryDataResults,
    selector: Selector,
    measures: Measures,
    field: Field,
    fieldTypes: Map<Field, FieldInfo>,
    filterFieldTypes: Map<Filter, FieldInfo>): Promise<void> {

    const fieldType = fieldTypes.get(field);
    if (!fieldType) throw new Error('No associated field type.');
    if (constants.numericalTypes.some(nt => nt === fieldType.type)) {
        await executeContinuousMetrics(queryDataResults, selector, measures, field, fieldTypes, filterFieldTypes);
        return Promise.resolve();
    }

    await executeCategoricalMetrics(queryDataResults, selector, measures, field, fieldTypes, filterFieldTypes);
}

export default {
    executeQueries
}




