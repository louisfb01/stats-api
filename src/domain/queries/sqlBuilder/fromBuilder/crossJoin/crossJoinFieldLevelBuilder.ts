import FieldPathForLevelBuilder from "./fieldPathForLevelBuilder";
import JsonFieldValueForLevelBuilder from "./jsonFieldValueForLevelBuilder";

export default class CrossJoinFieldLevelBuilder {
    jsonFieldValueForLevelBuilder: JsonFieldValueForLevelBuilder;
    fieldPathForLevelBuilder: FieldPathForLevelBuilder;

    constructor(field: [string, string]) {
        this.jsonFieldValueForLevelBuilder = new JsonFieldValueForLevelBuilder(field[0]);
        this.fieldPathForLevelBuilder = new FieldPathForLevelBuilder(field[1]);
    }

    hasRemainingPathToBuild() {
        return this.jsonFieldValueForLevelBuilder.hasRemainingPathToBuild();
    }

    buildCurrentLevel() {
        const jsonFieldValue = this.jsonFieldValueForLevelBuilder.buildCurrentLevel();
        const fieldPathFormatted = this.fieldPathForLevelBuilder.buildCurrentLevel();

        return `${jsonFieldValue} AS ${fieldPathFormatted}`;
    }

}