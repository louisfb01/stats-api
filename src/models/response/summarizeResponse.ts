import BreakdownResponse from "./breakdownResponse";
import FieldReponse from "./fieldResponse";

export default interface SummarizeResponse {
    total: number;
    fieldResponses: FieldReponse[];
    query: string;
    breakdown?: BreakdownResponse;
    error?: any;
}