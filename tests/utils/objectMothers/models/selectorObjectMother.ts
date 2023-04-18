import Breakdown from "../../../../src/models/request/breakdown";
import Field from "../../../../src/models/request/field";
import Filter from "../../../../src/models/request/filter";
import Selector from "../../../../src/models/request/selector";

function get(resource: string, label:string, fields: Field[], filters: Filter[], joins?: Selector): Selector {
    return {
        resource,
        label,
        fields,
        filters,
        joins
    }
}

export default {
    get
}