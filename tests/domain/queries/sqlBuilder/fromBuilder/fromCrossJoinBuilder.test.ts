import fromCrossJoinBuilder from "../../../../../src/domain/queries/sqlBuilder/fromBuilder/fromCrossJoinBuilder";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";

describe('fromCrossJoinBuilder tests', () => {
    const genderFilter = filterObjectMother.get('gender', 'is', 'male');
    const cityFilter = filterObjectMother.get('address.city', 'is', 'Quebec');

    beforeEach(() => {
        resourceArrayFields.values = [];
    })

    it('with one field array type, array element is last path element, field is added in CROSS JOIN LATERAL', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [genderFilter, cityFilter]);

        resourceArrayFields.values = ["address.city"];

        // ACT
        const query = fromCrossJoinBuilder.build(selector);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address'->'city') AS address_city")
    })

    it('with one field array type, with field and no filter, array element is last path element, field is added in CROSS JOIN LATERAL', () => {
        // ARRANGE
        const addressCityField = fieldObjectMother.get('address.city');
        const selector = selectorObjectMother.get('Patient', [], [genderFilter]);

        resourceArrayFields.values = ["address.city"];

        // ACT
        const query = fromCrossJoinBuilder.build(selector, addressCityField);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address'->'city') AS address_city")
    })

    it('with one field array type, array element is first path element, only array portion is in CROSS JOIN', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [genderFilter, cityFilter]);

        resourceArrayFields.values = ["address"];

        // ACT
        const query = fromCrossJoinBuilder.build(selector);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address")
    })

    it('with two fields array types, field are added in CROSS JOIN LATERAL', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [genderFilter, cityFilter]);

        resourceArrayFields.values = ["address.city", "gender"];

        // ACT
        const query = fromCrossJoinBuilder.build(selector);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'gender') AS gender, jsonb_array_elements(resource->'address'->'city') AS address_city")
    })

    it('with two arrays in field, two cross joins are generated', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [genderFilter, cityFilter]);

        resourceArrayFields.values = ["address", "address.city"];

        // ACT
        const query = fromCrossJoinBuilder.build(selector);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address CROSS JOIN LATERAL jsonb_array_elements(address->'city') AS address_city")
    })
})