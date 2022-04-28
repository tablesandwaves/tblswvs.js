import { Melody } from "./melody";
import { Sequence } from "./sequence";
import { Transformation } from "./transformation";


/**
 * A Rhythm is a sequence of 1s and 0s that can transform a Melody object by letting the Melody's notes
 * pass through for a rhythm 1, or "on", step and inserting rests for a rhythm 0, or "off", step.
 *
 * Like the MelodicVector class, the steps property of this class that stores its sequence data does
 * not need to have the same number of elements as in the Melody that it is transforming. The MelodicVector's
 * steps will instead be repeated until it is expanded to the size of the Melody's steps.
 */
export class Rhythm implements Sequence, Transformation {
    steps: (1|0)[];
    length?: number;
    fillMode: ("wrap"|"silence");


    /**
     * Create a new Rhythm.
     *
     * @param steps Array of 1s and 0s that will represent the rhythm.
     * @param fillMode "wrap" (default) or "silence" to determine how the rhythm will fill itself when longer than the melody
     * @param length number the length of the resulting melody after this rhythm is applied to it
     */
    constructor(steps: (1|0)[], fillMode: ("wrap"|"silence") = "wrap", length?: number) {
        this.steps = steps;
        this.fillMode = fillMode;
        this.length = length;
    }


    /**
     * Apply this rhythm to a given Melody.
     *
     * @param melody Melody to transform with by this rhythm
     * @returns a new Melody object with its steps transformed by this rhythm
     */
    applyTo(melody: Melody): Melody {
        const rhythmHits = this.steps.filter(step => step != 0).length;
        const stepHits = Math.ceil(melody.steps.length / rhythmHits);
        let transformedSequence = new Array(stepHits).fill(this.steps).flat();

        if (this.length !== undefined) {
            if (this.length > transformedSequence.length) {
                let remainingStepCount = this.length - transformedSequence.length;
                if (this.fillMode == "silence") {
                    transformedSequence.push(...new Array(remainingStepCount).fill(0));
                } else {
                    let remainingSteps = Math.ceil(remainingStepCount / this.steps.length);
                    transformedSequence.push(...new Array(remainingSteps).fill(this.steps).flat());
                }
            }
            /*
            * Truncate the sequence as a final check to make sure it is not longer than the rhythm length
            * This could happen because this Rhythm's steps are shorter than the transformations's
            * steps or because the transformedSequence filled out more steps than necessary
            */
            transformedSequence = transformedSequence.slice(0, this.length);
        }

        let processedStepIndex = 0;
        transformedSequence.forEach((step, i) => {
            if (step == 1) {
                transformedSequence[i] = melody.steps[processedStepIndex % melody.steps.length];
                processedStepIndex++;
            } else {
                transformedSequence[i] = melody.restSymbol;
            }
        });

        return new Melody(transformedSequence, melody.restSymbol, melody.melodicMode);
    }
}