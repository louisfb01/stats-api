import Field from "./field";
import Condition from "./condition";

export default interface Selector {
    resource: string;
    label: string;
    condition: Condition;
    fields: Field[];
    joins?: Selector;
}