import FieldInfo from "../../../models/fieldInfo";
import Field from "../../../models/request/field";
import Filter from "../../../models/request/filter";
import Selector from "../../../models/request/selector";
import fieldLabelFormatter from "../fieldLabelFormatter";
import arrayFieldDetector from "../fields/arrayFieldDetector";
import SqlBuilder from "../sqlBuilder/sqlBuilder";

function getQuery(selector: Selector,
    filterTypes: Map<Filter, FieldInfo>,
    fieldTypes: Map<Field, FieldInfo>): string {
        
    if (!selector.breakdown) throw new Error('Must have breakdown');

    const breakdownField = selector.breakdown.resource.field;
    const breakdownFieldLabel = findLabel(breakdownField, selector)
    
    const step = selector.breakdown?.slices.step;
    const max = parseInt(selector.breakdown?.slices.max);
    const min = parseInt(selector.breakdown?.slices.min);

    const sqlBuilder = new SqlBuilder()
        .select()
        .breakdownContinuous(step, min, max, breakdownFieldLabel)
        .comma()
        .countAll()
        .from()
        .subquery(fieldTypes)
        .groupBy()
        .compiledField('breakdown')

    return sqlBuilder.build(selector, filterTypes)
}

function findLabel(breakdownField: string, selector: Selector): string{
    const label = selector.fields.find(field => {
        return field.path == breakdownField;
    })?.label

    if(label){ 
        return fieldLabelFormatter.formatLabel(label)
    }
    else if(selector.joins){
        return findLabel(breakdownField, selector.joins)
    }
    else{
        return ''
    }
}

export default {
    getQuery
}