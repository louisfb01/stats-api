import CrossJoinFieldLevelBuilder from "../../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinFieldLevelBuilder";

function get(fieldPath: string) {
    return new CrossJoinFieldLevelBuilder(fieldPath);
}

export default {
    get
}