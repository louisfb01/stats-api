import jsonTypePathCompiler from "../../../src/domain/queries/jsonTypePathCompiler";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import resourceArrayFields from "../../../src/domain/resourceArrayFields";

describe('jsonTypePathCompiler tests', () => {

    beforeEach(() => {
        resourceArrayFields.values = [];
    })

    it('it combines resource with field path', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender');

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(resource->'gender')")
    })

    it('compiles level field path with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country');

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(resource->'address'->'country')")
    })

    it('compiles level field path two levels deep with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(resource->'address'->'country'->'name')")
    })

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const field = fieldObjectMother.get("gender'--drop");

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(resource->'gender')")
    })

    it('when value is array, field is wrapped with jsonb_array_elements', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender');

        resourceArrayFields.values = ["gender"];

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(jsonb_array_elements(resource->'gender'))")
    })

    it('when multiple values are arrays, appropriate portions of path are wrapped with jsonb_array_elements', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');

        resourceArrayFields.values = ["address", "address.country.name"];


        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(jsonb_array_elements(jsonb_array_elements(resource->'address')->'country'->'name'))")
    })
})