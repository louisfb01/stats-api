import FieldInfo from "../../../../../models/fieldInfo";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import arrayFieldDetector from "../../../fields/arrayFieldDetector";
import SqlBuilder from "../../sqlBuilder";

function build(selector: Selector, joinSelector: Selector, filterTypes: Map<Filter, FieldInfo>) {
    const sqlBuilder = new SqlBuilder()
        .select()

    if(hasFields(joinSelector)){
        sqlBuilder.fieldsJson().comma();
    }

    if (joinSelector.filters.length === 0) return sqlBuilder.joinId(selector).from().resourceTable().possibleFieldTypeJoin().build(joinSelector, filterTypes);

    const hasArrayFilters = joinSelector.filters.some(f => arrayFieldDetector.isArrayField(f.path));

    const builderWithFilter = hasArrayFilters
        ? sqlBuilder.joinId(selector).from().resourceTable().crossJoinForArrayFilters().possibleFieldTypeJoin().where().fieldFilter()
        : sqlBuilder.joinId(selector).from().resourceTable().possibleFieldTypeJoin().where().fieldFilter();

    return builderWithFilter.build(joinSelector, filterTypes);
}

function hasFields(selector: Selector): boolean {
    if(selector.fields.length > 0)
        return true
    else if(selector.joins)
        return hasFields(selector.joins)
    return false
}

export default {
    build
}