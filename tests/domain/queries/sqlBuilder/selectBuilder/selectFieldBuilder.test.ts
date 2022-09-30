import selectFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFieldBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";

describe('selectFieldBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    })

    it('gets json field as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');

        // ACT
        const result = selectFieldBuilder.build(field);

        // ASSERT
        expect(result).toEqual("resource->'address'->'country'->>'name' AS address_country_name");
    })

    it('with array field, gets json field array formatted as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');

        resourceArrayFields.values = ['address.country'];

        // ACT
        const result = selectFieldBuilder.build(field);

        // ASSERT
        expect(result).toEqual("address_country->>'name' AS address_country_name");
    })

    it('gets age field from calculated fields', () => {
        // ARRANGE
        const field = fieldObjectMother.get('age');

        // ACT
        const result = selectFieldBuilder.build(field);

        // ASSERT
        expect(result).toEqual("extract(year from AGE(date(resource->>'birthDate'))) as age");
    })
})