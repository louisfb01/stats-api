import selectFieldTypesBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFieldTypesBuilder";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother"
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectFieldTypeBuilder tests', () => {
    it('outputs selector fields as formatedFieldPath', () => {
        // ARRANGE
        const genderField = fieldObjectMother.get('gender');
        const ageField = fieldObjectMother.get('age');

        const selector = selectorObjectMother.get('Patient', [genderField, ageField], [])

        // ACT
        const result = selectFieldTypesBuilder.build(selector);

        // ASSERT
        expect(result).toEqual("jsonb_typeof(resource->'gender') AS gender, jsonb_typeof(resource->'age') AS age")
    })
})