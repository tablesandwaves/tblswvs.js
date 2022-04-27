import { Sequence } from "./sequence";
import { TblswvsError } from "./tblswvs_error";
import * as helpers from "./helpers";
import { Rhythm } from "./rhythm";


export enum MelodyType {
    MIDI    = "MIDI",
    Degrees = "Scale Degrees"
}


export class Melody implements Sequence {
    steps: (string|number)[];
    restSymbol: string | number;
    melodicMode: MelodyType;


    constructor(steps?: (string|number)[], restSymbol?: number | string, mode?: MelodyType) {

        this.steps = steps === undefined ? new Array<(string|number)>() : steps;
        this.restSymbol = restSymbol === undefined ? 0 : restSymbol;
        this.melodicMode = mode == undefined ? MelodyType.Degrees : mode;
    }


    /**
     * Clone this melody.
     * 
     * @returns a new copy of this object.
     */
    clone() {
        return new Melody(this.steps, this.restSymbol, this.melodicMode);
    }


    /**
     * Create a new Melody from multiple Melody objects.
     * 
     * Note that the melodies being combined must have the same restSymbol and melodicMode parameters
     * or this method will throw a TblswvsError.
     * 
     * @param sequences an Array of Melody objects
     * @returns a new Melody that combines the sequences steps
     */
    static newFrom(sequences: Melody[]) {
        const restSymbols = sequences.map(s => s.restSymbol).filter(helpers.unique);
        const modes       = sequences.map(s => s.melodicMode).filter(helpers.unique);
        if (restSymbols.length > 1 || modes.length > 1)
            throw new TblswvsError(helpers.INCOMPATIBLE_SEQ_MSG);

        const steps = sequences.map(s => s.steps).flat();
        return new Melody(steps, sequences[0].restSymbol, sequences[0].melodicMode);
    }


    /**
     * Generate a self-replicating melody based on this Melody's steps.
     *
     * @param length the number of steps for the ouput melody, must be coprime with this melody's length
     * @param ratio the ratio of self-similarity (step by amount). Optional, default: 2
     * @returns a new Melody object with steps that self-replicate at the ratio of N:1
     */
    selfReplicate(length: number, ratio?: number): Melody {
        ratio = ratio === undefined ? 2 : ratio;

        if (!helpers.areCoprime(length, ratio))
            throw new TblswvsError(helpers.SELF_SIMILARITY_REQUIRES_COPRIMES);


        let sequence = new Array(length).fill(-1);
        sequence[0] = this.steps[0];
        sequence[1] = this.steps[1];

        let contiguousSequence, currentNote, stepAmount, nextNote;
        let nextEmpty = sequence.findIndex(note => note == -1),
            count = 2;

        // Build a self replicating melody by powers of 2 until all notes are filled.
        do {
            contiguousSequence = sequence.slice(0, nextEmpty);

            for (let noteIndex = 0; noteIndex < contiguousSequence.length; noteIndex++) {
                // For each note in the contiguous sequence...
                currentNote = contiguousSequence[noteIndex];

                // Determine the self replicating step amounts by computing the powers of 2 for
                // non-redundant step amounts based on the target length
                for (let power = 1; power <= Math.log2(length); power++) {
                    stepAmount = ratio ** power;

                    // Fill in the melody's future step indices with the current replicating note.
                    sequence[(noteIndex * stepAmount) % length] = currentNote;
                }
            }

            // If the sequence still has empty spots, find the first one and fill it with the next
            // note in the input note list.
            nextNote = this.steps[count % this.steps.length];
            nextEmpty = sequence.findIndex(note => note == -1);
            if (nextEmpty != -1) sequence[nextEmpty] = nextNote;
            count++;
        } while (nextEmpty != -1);

        let melody = this.clone();
        melody.steps = sequence;
        return melody;
    }


    /**
     * The sequence counting pattern.
     * 
     * Given: 1 2 3
     * Generate:
     * Segment 1: 1 - 2 - 3 -
     * Segment 2: 1 2 - 3 1 - 2 3 -
     * Segment 3: 1 2 3 - 1 2 3 - 1 2 3 -
     * 
     * All segments are concatenated to form the steps of the resulting melody.
     * 
     * @returns a new Melody that conforms to the counting pattern
     */
    counted(): Melody {
        let sequence = new Array<(string|number)>();

        for (let i = 1; i <= this.steps.length; i++) {
            let rhythmSteps = new Array(i).fill(1);
            rhythmSteps.push(0);
            let length = this.steps.length * (i + 1);
            let rhythm = new Rhythm(rhythmSteps, "wrap", length);

            rhythm.applyTo(this).steps.forEach(step => sequence.push(step));
        }
        let countedMelody = this.clone();
        countedMelody.steps = sequence;

        return countedMelody;
    }


    /**
     * Logic: go 7 steps forward, 6 steps back through a melody
     * Given the melody: 1 2 3 4 5 6 7 8 9 10 11 12
     * Generate:
     * Segment 1:   1 2 3 4 5 6 7 7 6 5 4 3 2
     * Segment 2:   2 3 4 5 6 7 8 8 7 6 5 4 3
     * ...
     * Segment 11: 11 12 1 2 3 4 5 5 4 3 2 1 12
     * Segment 12: 12 1 2 3 4 5 6 6 5 4 3 2 1
     * 
     * @returns a new Melody that conforms to the zig-zag pattern.
     */
    zigZag(): Melody {
        let turnAroundStep = this.steps.length % 2 == 0 ? this.steps.length / 2 + 1 : Math.ceil(this.steps.length / 2);
        let steps = this.steps.reduce((previous, current, i) => {
            let segment = new Array(turnAroundStep).fill(-1).map((_, j) => this.steps[(j + i) % this.steps.length]);
            previous.push(segment);
            previous.push(segment.slice(1, turnAroundStep).reverse());
            return previous;
        }, new Array()).flat();

        return new Melody(steps);
    }
}
