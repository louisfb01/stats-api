import fieldLabelFormatter from "../../../../src/domain/queries/fieldLabelFormatter";
import Field from "../../../../src/models/request/field";

function get(path: string): Field {
    return {
        path,
        label: fieldLabelFormatter.formatLabel(path)
    }
}

export default {
    get
}