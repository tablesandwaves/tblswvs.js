import { Sequence } from "./sequence";
import { Melody, MelodyType } from "./melody";
import { Transformation } from "./transformation";


/**
 * A MelodicVector is a sequence of numbers that can transform a Melody object by applying vector
 * addition to a numerical representation of the Melody's note data.
 *
 * This class is not a true vector in the mathematical sense. For example, the steps property of
 * this class that stores its sequence data does not need to have the same number of elements as
 * in the Melody that it is transforming. The MelodicVector's steps will instead be repeated until
 * it is expanded to the size of the Melody's steps.
 */
export class MelodicVector implements Sequence, Transformation {
    steps: number[];


    /**
     * Create a new MelodicVector object.
     *
     * @param steps number[] the steps that represent the object's vector
     */
    constructor(steps: number[]) {
        this.steps = steps;
    }


    /**
     * Transforms a melody by vector addition. Note that the vector step length and melody step
     * length do not need to be equal.
     * 
     * @param Melody the melody to transform withe the current vector
     * @returns new Melody with steps based on summing the input melody steps and the vector steps
     */
    applyTo(melody: Melody): Melody {
        // First generate an array of steps that will match the melody's length.
        const size = Math.ceil((melody.steps.length / this.steps.length));
        const expandedSteps = new Array(size).fill(this.steps).flat().slice(0, melody.steps.length);

        // Create a copy of the melody so that the rest symbol and mode are carried forward.
        // Then apply the vector addition.
        const transformedMelody = melody.clone();
        transformedMelody.steps = expandedSteps.map((step, i) => {
            if (melody.melodicMode == MelodyType.Degrees && melody.steps[i] == 0)
                return 0;
            else if (melody.steps[i] == melody.restSymbol)
                return melody.steps[i];
            else
                return step + melody.steps[i];
        });

        return transformedMelody;
    }
}