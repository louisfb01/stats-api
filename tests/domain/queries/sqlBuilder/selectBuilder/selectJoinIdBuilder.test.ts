import selectJoinIdBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectJoinIdBuilder"
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother"

describe('selectJoinIdBuilder tests', () => {
    const testParams = [
        { resource: 'Observation', joinResource: "Patient", selectId: "resource->'subject'->>'id' AS subject_id" },
        { resource: 'Patient', joinResource: "Observation", selectId: "id" },
    ]

    for (let testParam of testParams) {
        it(`returns ${testParam.selectId} for resource ${testParam.joinResource}`, () => {
            const joinSelector = selectorObjectMother.get(testParam.joinResource, 'label', [], []);
            const selector = selectorObjectMother.get(testParam.resource, 'label', [], [], joinSelector);

            expect(selectJoinIdBuilder.build(selector)).toEqual(testParam.selectId);
        })
    }

    it(`escapes sql injection`, () => {
        const joinSelector = selectorObjectMother.get("Patient'--drop", 'patient', [], []);
        const selector = selectorObjectMother.get("Observation'--drop", 'observation', [], []);

        expect(selectJoinIdBuilder.build(joinSelector)).toEqual("id");
    })
})