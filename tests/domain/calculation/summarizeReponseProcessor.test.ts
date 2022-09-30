import { when } from "jest-when";
import timeBreakdownCalculator from "../../../src/domain/calculation/breakdown/timeBreakdownCalculator";
import fieldReponseProcessor from "../../../src/domain/calculation/fieldReponseProcessor";
import summarizeReponseProcessor from "../../../src/domain/calculation/summarizeReponseProcessor";
import FieldInfo from "../../../src/models/fieldInfo";
import Field from "../../../src/models/request/field";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother"
import breakdownResponseObjectMother from "../../utils/objectMothers/models/reponse/breakdownResponseObjectMother";
import fieldResponseObjectMother from "../../utils/objectMothers/models/reponse/fieldResponseObjectMother";
import breakdownObjectMother from "../../utils/objectMothers/models/request/breakdownObjectMother";
import measuresObjectMother from "../../utils/objectMothers/models/request/measuresObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('summarizeReponseProcessor tests', () => {
    const fieldA = fieldObjectMother.get('fieldA');
    const fieldB = fieldObjectMother.get('fieldB');

    const fieldAReponse = fieldResponseObjectMother.get('fieldA');
    const fieldBReponse = fieldResponseObjectMother.get('fieldB');

    const measures = measuresObjectMother.get();
    const fieldsMap = new Map<Field, FieldInfo>();

    it('when aidbox response is error, indicates error', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patiend', [], []);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorResult(selector, { query: 'SELECT * FROM Patient', result: new Error('error') });

        // ACT
        const summarizeReponse = summarizeReponseProcessor.getSummarizeReponse(selector, measures, queryDataResults, fieldsMap);

        // ASSERT
        expect(summarizeReponse.error).toEqual(new Error('error'));
    })

    it('gets aidbox total and queryUri for summarize response', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [], []);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorResult(selector, { query: 'SELECT * FROM Patient', result: { count: 999 } });

        // ACT
        const summarizeReponse = summarizeReponseProcessor.getSummarizeReponse(selector, measures, queryDataResults, fieldsMap);

        // ASSERT
        expect(summarizeReponse.total).toEqual(999);
        expect(summarizeReponse.query).toBe('SELECT * FROM Patient');
    })

    it('gets field responses from selector fields', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patiend', [fieldA, fieldB], []);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorResult(selector, { query: 'SELECT * FROM Patient', result: { count: 999 } });

        fieldReponseProcessor.getFieldReponse = jest.fn();
        when(fieldReponseProcessor.getFieldReponse as any)
            .calledWith(selector, fieldA, measures, queryDataResults, fieldsMap)
            .mockReturnValue(fieldAReponse)
            .calledWith(selector, fieldB, measures, queryDataResults, fieldsMap)
            .mockReturnValue(fieldBReponse);

        // ACT
        const summarizeReponse = summarizeReponseProcessor.getSummarizeReponse(selector, measures, queryDataResults, fieldsMap);

        // ASSERT
        expect(summarizeReponse.fieldResponses.length).toEqual(2);

        expect(summarizeReponse.fieldResponses[0]).toBe(fieldAReponse);
        expect(summarizeReponse.fieldResponses[1]).toBe(fieldBReponse);
    })

    it('gets aidbox breakdown and queryUri for summarize response', () => {
        // ARRANGE
        const breakdown = breakdownObjectMother.get('Patient', 'gender', 60);
        const selector = selectorObjectMother.get('Patient', [], [], undefined, breakdown);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addSelectorResult(selector, { query: 'SELECT * FROM Patient', result: { count: 999 } });

        const breakdownResult = breakdownResponseObjectMother.get();
        timeBreakdownCalculator.calculate = jest.fn();
        when(timeBreakdownCalculator.calculate as any)
            .calledWith(selector, queryDataResults)
            .mockReturnValue(breakdownResult);

        // ACT
        const summarizeReponse = summarizeReponseProcessor.getSummarizeReponse(selector, measures, queryDataResults, fieldsMap);

        // ASSERT
        expect(summarizeReponse.breakdown).toBe(breakdownResult);
    })
})