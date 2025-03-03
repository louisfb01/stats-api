import FieldInfo from "../../../models/fieldInfo";
import Filter from "../../../models/request/filter";
import Selector from "../../../models/request/selector";
import arrayFieldDetector from "./arrayFieldDetector";
import SqlBuilder from "../sqlBuilder/sqlBuilder";

function getQuery(selector: Selector, filterTypes: Map<Filter, FieldInfo>): string {

    const sqlBuilder = new SqlBuilder()
        .select()
        .distinct()
        .fieldTypes()
        .from()
        .resourceTable();

    if (selector.condition.conditions.length === 0) return sqlBuilder.possibleFieldTypeJoin().build(selector, filterTypes);

    const hasArrayFilters = arrayFieldDetector.hasArrayFilters(selector.condition);

    const builderWithFilter = hasArrayFilters
        ? sqlBuilder.crossJoinForArrayFilters().possibleFieldTypeJoin().where().fieldFilter()
        : sqlBuilder.possibleFieldTypeJoin().where().fieldFilter();
    return builderWithFilter.build(selector, filterTypes);

}

export default {
    getQuery
}