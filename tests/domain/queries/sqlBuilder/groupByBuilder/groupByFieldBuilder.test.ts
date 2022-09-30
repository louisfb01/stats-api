import groupByFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/groupByBuilder/groupByFieldBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother"

describe('groupByFieldBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    })

    it('Gets json field path formatted', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');

        // ACT
        const result = groupByFieldBuilder.build(field);

        // ASSERT
        expect(result).toEqual("resource->'address'->'country'->>'name'");
    })

    it('Gets json array field path formatted', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');

        resourceArrayFields.values = ['address.country'];


        // ACT
        const result = groupByFieldBuilder.build(field);

        // ASSERT
        expect(result).toEqual("address_country->>'name'");
    })
})