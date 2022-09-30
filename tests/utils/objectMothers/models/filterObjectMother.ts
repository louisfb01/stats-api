import Filter from "../../../../src/models/request/filter";

function get(path: string, operator: string, value: string): Filter {
    return {
        path,
        operator,
        value
    }
}

export default {
    get
}