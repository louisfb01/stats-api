import Breakdown from "../../../../src/models/request/breakdown";
import Field from "../../../../src/models/request/field";
import Filter from "../../../../src/models/request/filter";
import Selector from "../../../../src/models/request/selector";

function get(resource: string, fields: Field[], filters: Filter[], joins?: Selector, breakdown?: Breakdown): Selector {
    return {
        resource,
        fields,
        filters,
        joins,
        breakdown
    }
}

export default {
    get
}