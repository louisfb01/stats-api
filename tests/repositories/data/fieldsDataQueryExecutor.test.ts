import FieldInfo from "../../../src/models/fieldInfo";
import CategoricalMesure from "../../../src/models/categoricalMeasure";
import ContinuousMesure from "../../../src/models/continuousMeasure";
import Field from "../../../src/models/request/field";
import fieldsDataQueryExecutor from "../../../src/repositories/data/fieldsDataQueryExecutor";
import fieldsMeasureDataQueryExecutor from "../../../src/repositories/data/fieldsMeasureDataQueryExecutor";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import aidboxFieldResponseObjectMother from "../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother"
import measuresObjectMother from "../../utils/objectMothers/models/request/measuresObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";
import Filter from "../../../src/models/request/filter";

describe('fieldsDataQueryExecutor tests', () => {
    const allOptionsMeasures = measuresObjectMother.getAllOptionMeasures();

    const field = fieldObjectMother.get('field');

    const numberFieldType = aidboxFieldResponseObjectMother.get('number');
    const decimalFieldType = aidboxFieldResponseObjectMother.get('decimal');
    const textFieldType = aidboxFieldResponseObjectMother.get('text');

    const filterMaps = new Map<Filter, FieldInfo>();

    beforeEach(() => {
        fieldsMeasureDataQueryExecutor.exectuteQuery = jest.fn();
    })


    it('integer field, all measures chosen, all continuous measures calculated', async () => {
        // ARRANGE
        const fieldsMap = getFieldsMap([field], [numberFieldType]);
        const selector = selectorObjectMother.get('Patient', [field], []);

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await fieldsDataQueryExecutor.executeQueries(queryDataResults, selector, allOptionsMeasures, field, fieldsMap, filterMaps);

        // ASSERT
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.count, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.mean, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.stdev, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.ci95, fieldsMap, filterMaps);
    })

    it('decimal field, all measures chosen, all continuous measures calculated', async () => {
        // ARRANGE
        const fieldsMap = getFieldsMap([field], [decimalFieldType]);
        const selector = selectorObjectMother.get('Patient', [field], []);

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await fieldsDataQueryExecutor.executeQueries(queryDataResults, selector, allOptionsMeasures, field, fieldsMap, filterMaps);

        // ASSERT
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.count, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.mean, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.stdev, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.ci95, fieldsMap, filterMaps);
    })

    it('integer field, two continuous measures chosen, both measures calculated', async () => {
        // ARRANGE
        const fieldsMap = getFieldsMap([field], [numberFieldType]);
        const selector = selectorObjectMother.get('Patient', [field], []);
        const measures = measuresObjectMother.get([], [ContinuousMesure.mean, ContinuousMesure.ci95])

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await fieldsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, field, fieldsMap, filterMaps);

        // ASSERT
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.mean, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, ContinuousMesure.ci95, fieldsMap, filterMaps);
    })

    it('text field, all measures chosen, all categorical measures calculated', async () => {
        // ARRANGE
        const fieldsMap = getFieldsMap([field], [textFieldType]);
        const selector = selectorObjectMother.get('Patient', [field], []);

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await fieldsDataQueryExecutor.executeQueries(queryDataResults, selector, allOptionsMeasures, field, fieldsMap, filterMaps);

        // ASSERT
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, CategoricalMesure.count, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, CategoricalMesure.mode, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, CategoricalMesure.marginals, fieldsMap, filterMaps);
    })

    it('text field, two measures chosen, both categorical measures calculated', async () => {
        // ARRANGE
        const fieldsMap = getFieldsMap([field], [textFieldType]);
        const selector = selectorObjectMother.get('Patient', [field], []);
        const measures = measuresObjectMother.get([CategoricalMesure.count, CategoricalMesure.marginals])

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await fieldsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, field, fieldsMap, filterMaps);

        // ASSERT
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, CategoricalMesure.count, fieldsMap, filterMaps);
        expect(fieldsMeasureDataQueryExecutor.exectuteQuery).toHaveBeenCalledWith(queryDataResults, selector, field, CategoricalMesure.marginals, fieldsMap, filterMaps);
    })

    function getFieldsMap(fields: Field[], aidboxFields: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], aidboxFields[fieldIndex]);
        }

        return fieldsMap;
    }
})