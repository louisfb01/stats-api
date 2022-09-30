import selectFilterTypesBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFilterTypesBuilder";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectFilterTypeBuilder tests', () => {
    it('outputs selector filters as formatedFieldPath', () => {
        // ARRANGE
        const genderFieldFilter = filterObjectMother.get('gender', 'is', 'female');
        const ageField = filterObjectMother.get('age', 'is', '27');

        const selector = selectorObjectMother.get('Patient', [], [genderFieldFilter, ageField])

        // ACT
        const result = selectFilterTypesBuilder.build(selector);

        // ASSERT
        expect(result).toEqual("jsonb_typeof(resource->'gender') AS gender, jsonb_typeof(resource->'age') AS age")
    })
})