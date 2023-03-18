import { Melody } from "./melody";
import { Transformation } from "./transformation";
import * as helpers from "./helpers";
import { TblswvsError } from "./tblswvs_error";


/**
 * A MelodicVector is a sequence of numbers that can transform a Melody object by applying vector
 * addition to a numerical representation of the Melody's note data.
 *
 * This class is not a true vector in the mathematical sense. For example, the steps property of
 * this class that stores its sequence data does not need to have the same number of elements as
 * in the Melody that it is transforming. The MelodicVector's steps will instead be repeated until
 * it is expanded to the size of the Melody's steps.
 */
export class MelodicVector implements Transformation {
    steps: number[];
    shiftMode: ("midi"|"scale") = "midi";


    /**
     * Create a new MelodicVector object.
     *
     * @param steps number[] the steps that represent the object's vector
     */
    constructor(steps: number[], shiftMode?: ("midi"|"scale")) {
        this.steps = steps;
        if (shiftMode != undefined) this.shiftMode = shiftMode;
    }


    /**
     * Transforms a melody by vector addition. Note that the vector step length and melody step
     * length do not need to be equal.
     *
     * @param Melody the melody to transform withe the current vector
     * @returns new Melody with steps based on summing the input melody steps and the vector steps
     */
    applyTo(melody: Melody): Melody {
        if (melody.key == undefined && this.shiftMode == "scale") {
            throw new TblswvsError(helpers.SCALE_DEGREE_SHIFTS_REQUIRE_KEY);
        } else {
            // First generate an array of steps that will match the melody's length.
            const size = Math.ceil((melody.notes.length / this.steps.length));
            const expandedSteps = new Array(size).fill(this.steps).flat().slice(0, melody.notes.length);

            // Create a copy of the melody so that the rest symbol and mode are carried forward.
            // Then apply the vector addition.
            const transformedMelody = melody.clone();
            expandedSteps.forEach((step, i) => {

                if (melody.notes[i].note == "rest") {
                    // Do Nothing
                } else if (this.shiftMode == "midi") {
                    transformedMelody.notes[i].midi += step;

                    const scaleNoteIndex = transformedMelody.key?.scaleNotes.indexOf(transformedMelody.key?.midi2note(transformedMelody.notes[i].midi).replace(/\d+/, ""));
                    if (scaleNoteIndex == undefined || scaleNoteIndex == -1)
                        transformedMelody.notes[i].scaleDegree = undefined;
                    else
                        transformedMelody.notes[i].scaleDegree = scaleNoteIndex + 1;

                } else {
                    const currentDeg = transformedMelody.notes[i].scaleDegree;
                    const newNote = transformedMelody.key?.degree(currentDeg + step);
                    if (newNote != undefined) transformedMelody.notes[i] = newNote;
                }
            });

            return transformedMelody;
        }
    }
}
