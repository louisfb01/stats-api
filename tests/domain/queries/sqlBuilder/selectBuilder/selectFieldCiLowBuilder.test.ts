import selectFieldCiLowBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFieldCiLowBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectFieldCiLowBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    })

    it('gets sum of json field as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender');
        const patientSelector = selectorObjectMother.get('Patient', [field], []);

        // ACT
        const result = selectFieldCiLowBuilder.build(field, patientSelector);

        // ASSERT
        expect(result).toEqual("percentile_disc(0.05) within group (order by resource->>'gender') AS ci_low");
    })

    it('with array field, gets json field array formatted as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name');
        const patientSelector = selectorObjectMother.get('Patient', [field], []);

        resourceArrayFields.values = ['address.country'];

        // ACT
        const result = selectFieldCiLowBuilder.build(field, patientSelector);

        // ASSERT
        expect(result).toEqual("percentile_disc(0.05) within group (order by address_country->>'name') AS ci_low");
    })

    it('gets age field from calculated fields', () => {
        // ARRANGE
        const field = fieldObjectMother.get('age');
        const patientSelector = selectorObjectMother.get('Patient', [field], []);

        // ACT
        const result = selectFieldCiLowBuilder.build(field, patientSelector);

        // ASSERT
        expect(result).toEqual("percentile_disc(0.05) within group (order by CASE WHEN resource->'deceased'->>'dateTime' IS NULL OR resource->'deceased'->>'dateTime' = 'NaT' THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END) AS ci_low");
    })
})