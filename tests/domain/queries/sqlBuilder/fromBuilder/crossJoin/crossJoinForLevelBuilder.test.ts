import resourceArrayFields from "../../../../../../src/domain/resourceArrayFields";
import crossJoinForLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinForLevelBuilderObjectMother";
import fieldObjectMother from "../../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('CrossJoinForLevelBuilder tests', () => {
    const maleGenderFilter = filterObjectMother.get('gender', 'is', 'male');
    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female');
    const cityFilter = filterObjectMother.get('address.city', 'is', 'Quebec');
    const countryFilter = filterObjectMother.get('address.country', 'is', 'Quebec');

    beforeEach(() => {
        resourceArrayFields.values = [];
    })

    it('with no filter, has no remaining path to build', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], []);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    })

    it('with filter, no array in filter, has no remaining path to build', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [cityFilter]);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    })

    it('with two filters, one array in each, builds in one level', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [maleGenderFilter, cityFilter]);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['gender', 'address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'gender') AS gender, jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    })

    it('with one filter and field, one array in each, builds in one level', () => {
        // ARRANGE
        const genderField = fieldObjectMother.get('gender')
        const selector = selectorObjectMother.get('Patient', [], [cityFilter]);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector, genderField);

        resourceArrayFields.values = ['gender', 'address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'gender') AS gender, jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    })

    it('with two filters, one array in each, array of each yield same field, field is only included once', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [cityFilter, countryFilter]);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['gender', 'address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    })

    it('with two filters and field, one array in each, array of each yield same field, field is only included once', () => {
        // ARRANGE
        const cityField = fieldObjectMother.get('address.city')
        const selector = selectorObjectMother.get('Patient', [], [cityFilter, countryFilter]);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector, cityField);

        resourceArrayFields.values = ['gender', 'address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    })

    it('with two filters, array in second, builds in one level with only filter that has array', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [maleGenderFilter, cityFilter]);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['address'];


        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    })

    it('with two filters, same field in filter, filter is only once in cross join', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [maleGenderFilter, femaleGenderFilter]);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['gender'];


        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'gender') AS gender");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    })

    it('with two arrays in filter, builds in two level', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], [maleGenderFilter, cityFilter]);
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['address', 'address.city'];

        const levelAPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();

        // ACT
        const levelBPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address");
        expect(levelBPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(address->'city') AS address_city");

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    })
})