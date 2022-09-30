import ContinuousMeanResponse from "./continuousMeanResponse";
import DiscreteVariableCountReponse from "./discreteVariableCountReponse";
import DiscreteVariableMarginalResponse from "./discreteVariableMarginalReponse";

export default interface FieldReponse {
    field: string;
    queries: string[];
    mean?: ContinuousMeanResponse;
    stdev?: number;
    ci95?: number[];
    count?: number | DiscreteVariableCountReponse[];
    mode?: string;
    marginal?: DiscreteVariableMarginalResponse;
}