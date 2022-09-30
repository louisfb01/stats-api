import Options from "./options";
import Selector from "./selector";

export default interface SummerizeRequestBody {
    selectors: Selector[];
    options: Options;
}