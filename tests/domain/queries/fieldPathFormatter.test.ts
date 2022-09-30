import fieldPathFormatter from "../../../src/domain/queries/fieldPathFormatter";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import resourceArrayFields from "../../../src/domain/resourceArrayFields";

describe('fieldPathFormatter tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = [];
    })

    it('with no sub path, returns field path', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender');

        // ACT
        const pathCompiled = fieldPathFormatter.formatPath(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("gender")
    })

    it('with sub path replaces . with _', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country');

        // ACT
        const pathCompiled = fieldPathFormatter.formatPath(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("address_country")
    })

    it('with two level sub path replaces . with _', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');

        // ACT
        const pathCompiled = fieldPathFormatter.formatPath(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("address_country_name")
    })

    it('with sub path replaces . with _ and lower characters', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.Country');

        // ACT
        const pathCompiled = fieldPathFormatter.formatPath(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("address_country")
    })

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const field = fieldObjectMother.get("gender'--drop");

        // ACT
        const pathCompiled = fieldPathFormatter.formatPath(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("gender")
    })
})