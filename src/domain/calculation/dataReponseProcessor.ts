import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import SummarizeRequestBody from "../../models/request/summarizeRequestBody";
import SummarizeResponse from "../../models/response/summarizeResponse";
import QueryDataResults from "../queries/queryDataResults";
import summarizeReponseProcessor from "./summarizeReponseProcessor";

function getSummarizeReponses(summarizeRequest: SummarizeRequestBody,
    queryDataResults: QueryDataResults,
    fieldTypes: Map<Field, FieldInfo>): SummarizeResponse[] {

    const summarizeReponses = new Array<SummarizeResponse>();

    const measures = summarizeRequest.options.measures;

    for (let reponseIndex = 0; reponseIndex < summarizeRequest.selectors.length; reponseIndex++) {
        const selector = summarizeRequest.selectors[reponseIndex];

        const summarizeReponse = summarizeReponseProcessor.getSummarizeReponse(selector, measures, queryDataResults, fieldTypes);
        summarizeReponses.push(summarizeReponse);
    }

    return summarizeReponses;
}

export default {
    getSummarizeReponses
}