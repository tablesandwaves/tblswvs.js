import { Melody } from "./melody";


export interface Transformation {
    applyTo(melody: Melody): Melody;
}