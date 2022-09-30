import selectCountFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectCountFieldBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectCountFieldBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    })

    it('counts json field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');
        const patientSelector = selectorObjectMother.get('Patient', [field], []);

        // ACT
        const result = selectCountFieldBuilder.build(field, patientSelector);

        // ASSERT
        expect(result).toEqual("count(resource->'address'->'country'->>'name')")
    })

    it('with array field, counts json field array formatted with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');
        const patientSelector = selectorObjectMother.get('Patient', [field], []);

        resourceArrayFields.values = ['address.country'];

        // ACT
        const result = selectCountFieldBuilder.build(field, patientSelector);

        // ASSERT
        expect(result).toEqual("count(address_country->>'name')")
    })
})