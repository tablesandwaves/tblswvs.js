import { Sequence } from "./sequence";
import { Melody } from "./melody";
import { MusicalSymbol } from "./musical_symbol";
import { Transformation } from "./transformation";


export class MelodicVector implements Sequence, Transformation {
    steps: number[];


    constructor(steps: number[]) {
        this.steps = steps;
    }


    values() {
        return this.steps;
    }


    /**
     * Transforms a melody by vector addition. Note that the vector step length and melody step
     * length do not need to be equal.
     * 
     * @param melody the melody to transform withe the current vector
     * @returns new Melody with steps based on summing the input melody steps and the vector steps
     */
    applyTo(melody: Melody): Melody {
        // First generate an array of steps that will match the melody's length.
        const size = Math.ceil((melody.steps.length / this.steps.length));
        const expandedSteps = new Array(size)
            .fill([1, 0])
            .flat()
            .slice(0, melody.steps.length);

        // Create a copy of the melody so that the rest symbol and mode are carried forward.
        // Then apply the vector addition.
        const transformedMelody = melody.clone();
        transformedMelody.steps = expandedSteps.map((step, i) => step + melody.steps[i].value)
            .map(step => new MusicalSymbol(step));
        return transformedMelody;
    }
}