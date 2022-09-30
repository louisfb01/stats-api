import fromSubqueryBuilder from "../../../../../src/domain/queries/sqlBuilder/fromBuilder/fromSubqueryBuilder";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother"
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";

describe('fromSubqueryBuilder tests', () => {
    const genderField = fieldObjectMother.get('gender');
    const cityAddressField = fieldObjectMother.get('address.city');

    const quebecCityFilter = filterObjectMother.get('address.city', 'is', 'Quebec');
    const maleGenderFilter = filterObjectMother.get('gender', 'is', 'male');
    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');

    const fieldAFilter = filterObjectMother.get('fieldA', 'is', 'valueA');
    const fieldBFilter = filterObjectMother.get('fieldB', 'is', 'valueB');

    beforeEach(() => {
        resourceArrayFields.values = [];
    })

    it('with field, no filter, no array field is selected with good nomenclature', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], []);

        // ACT
        const result = fromSubqueryBuilder.build(selector, genderField, 'SQ');

        // ASSERT
        expect(result).toEqual("(SELECT resource->>'gender' AS gender FROM Patient) AS SQ");
    })

    it('with array field, no filter, field is unrolled and selected with good nomenclature', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [cityAddressField], []);
        resourceArrayFields.values = ['address'];

        // ACT
        const result = fromSubqueryBuilder.build(selector, cityAddressField, 'SQ');

        // ASSERT
        expect(result).toEqual("(SELECT jsonb_array_elements(resource->'address')->>'city' AS address_city FROM Patient) AS SQ");
    })

    it('with array field and filter, field and filter are unrolled and selected with good nomenclature', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], [quebecCityFilter]);
        resourceArrayFields.values = ['address'];

        // ACT
        const result = fromSubqueryBuilder.build(selector, genderField, 'SQ');

        // ASSERT
        expect(result).toEqual("(SELECT resource->>'gender' AS gender, jsonb_array_elements(resource->'address')->>'city' AS address_city FROM Patient) AS SQ");
    })

    it('with field and two filters, field and filters are selected with good nomenclature', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], [fieldAFilter, fieldBFilter]);

        // ACT
        const result = fromSubqueryBuilder.build(selector, genderField, 'SQ');

        // ASSERT
        expect(result).toEqual("(SELECT resource->>'gender' AS gender, resource->>'fieldA' AS fielda, resource->>'fieldB' AS fieldb FROM Patient) AS SQ");
    })

    it('with field and filter, both same field, field is only once in subquery', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [genderField], [maleGenderFilter]);

        // ACT
        const result = fromSubqueryBuilder.build(selector, genderField, 'SQ');

        // ASSERT
        expect(result).toEqual("(SELECT resource->>'gender' AS gender FROM Patient) AS SQ");
    })

    it('with city field, two filters same field, filter field is only included once', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [cityAddressField], [maleGenderFilter, femaleGenderFilter]);

        // ACT
        const result = fromSubqueryBuilder.build(selector, cityAddressField, 'SQ');

        // ASSERT
        expect(result).toEqual("(SELECT resource->'address'->>'city' AS address_city, resource->>'gender' AS gender FROM Patient) AS SQ");
    })
})