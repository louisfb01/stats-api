import selectJoinIdBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectJoinIdBuilder"
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother"

describe('selectJoinIdBuilder tests', () => {
    const testParams = [
        { resource: 'Observation', joinResource: "Patient", selectId: "id" },
        { resource: 'Patient', joinResource: "Observation", selectId: "resource->'subject'->>'id' AS subject_id" },
    ]

    for (let testParam of testParams) {
        it(`returns ${testParam.selectId} for resource ${testParam.joinResource}`, () => {
            const joinSelector = selectorObjectMother.get(testParam.joinResource, [], []);
            const selector = selectorObjectMother.get(testParam.resource, [], [], joinSelector);

            expect(selectJoinIdBuilder.build(selector, joinSelector)).toEqual(testParam.selectId);
        })
    }

    it(`escapes sql injection`, () => {
        const joinSelector = selectorObjectMother.get("Patient'--drop", [], []);
        const selector = selectorObjectMother.get("Observation'--drop", [], []);

        expect(selectJoinIdBuilder.build(selector, joinSelector)).toEqual("id");
    })
})