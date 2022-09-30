import BreakdownResource from "../../../../../src/models/request/breakdownResource"

function get(type: string, field: string): BreakdownResource {
    return {
        type,
        field
    }
}

export default {
    get
}