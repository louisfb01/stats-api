import Breakdown from "../../../../models/request/breakdown";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(breakdown: Breakdown, breakdownFieldLabel: string) {
    const step = breakdown.slices.step;

    return `to_timestamp(floor((extract('epoch' from (${breakdownFieldLabel})::timestamp) / ${step} )) * ${step}) AS period_start`;
}

export default {
    build
}