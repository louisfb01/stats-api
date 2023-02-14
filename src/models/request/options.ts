import Breakdown from "./breakdown";
import Measures from "./measures";

export default interface Options {
    measures: Measures;
    breakdown?: Breakdown;
}