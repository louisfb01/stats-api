import CategoricalMesure from "../categoricalMeasure";
import ContinuousMesure from "../continuousMeasure";

export default interface Measures {
    continuous: ContinuousMesure[];
    categorical: CategoricalMesure[];
}