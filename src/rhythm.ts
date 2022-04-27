import { Melody } from "./melody";
import { Sequence } from "./sequence";
import { Transformation } from "./transformation";


export class Rhythm implements Sequence, Transformation {
    steps: (1|0)[];
    length?: number;
    fillMode: ("wrap"|"silence");


    constructor(steps: (1|0)[], fillMode: ("wrap"|"silence") = "wrap", length?: number) {
        this.steps = steps;
        this.fillMode = fillMode;
        this.length = length;
    }


    values(): (1|0)[] {
        return this.steps;
    }


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