import BreakdownSlices from "./breadkdownSlices";
import BreakdownResource from "./breakdownResource";

export default interface Breakdown {
    resource: BreakdownResource;
    slices: BreakdownSlices;
    query?: string;
}
