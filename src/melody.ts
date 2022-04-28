import { Sequence } from "./sequence";
import { TblswvsError } from "./tblswvs_error";
import * as helpers from "./helpers";
import { Rhythm } from "./rhythm";


/**
 * The primary melody types: MIDI and Scale Degrees.
 *
 * MIDI mode means that integers in a Melody's steps property should be interpreted as MIDI note numbers.
 *
 * Scale Degrees mode means that numbers in a Melody should interpreted as scale degrees where the number 1
 * is represented as the scale's tonic. For example, with a 7 note scale like the western modal scales, 8 is 
 * then interpreted as the tonic raised by 1 octave. Scale degrees should be greater than or equal to 1 and
 * the number 0 is interpreted as a rest.
 */
export enum MelodyType {
    MIDI    = "MIDI",
    Degrees = "Scale Degrees"
}


/**
 * The Melody class represents the primary melodic object. A melody has steps that are intended to represet
 * a sequence of notes and rests. It stores its rest symbol and its melodic mode, which should come from the
 * MelodyType enum.
 */
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
     * Zig zag through a melody in a wraparound mode.
     *
     * Logic: go 7 steps forward, 6 steps back through a melody
     * Given the melody: 1 2 3 4 5 6 7 8 9 10 11 12
     * Generate:
     * Segment 1:   1 2 3 4 5 6 7 7 6 5 4 3 2
     * Segment 2:   2 3 4 5 6 7 8 8 7 6 5 4 3
     * ...
     * Segment 11: 11 12 1 2 3 4 5 5 4 3 2 1 12
     * Segment 12: 12 1 2 3 4 5 6 6 5 4 3 2 1
     *
     * All segments are concatenated to form the steps of the resulting melody.
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


    /**
     * Generate the Norgard infinity series sequence.
     *
     * @param seed the sequence's first two steps, defaults to 0, 1
     * @param size the length of the resulting Meldoy's steps, defaults to 16
     * @param offset offset in the returned sequence from which the sequence starts
     * @returns a Melody with the infinity series as its steps
     */
    static infinitySeries(seed: number[] = [0, 1], size: number = 16, offset: number = 0) {
        let   melody = new Melody();
        const root   = seed[0];
        const step1  = seed[1];
        const seedInterval = step1 - root;

        melody.steps = Array.from(new Array(size), (n, i) => i + offset).map(step => {
            return root + (Melody.norgardInteger(step) * seedInterval);
        });

        return melody;
    }


    /**
     * Returns the value for any index of the base infinity series sequence (0, 1 seed). This function enables
     * an efficient way to compute any arbitrary section of the infinity series without needing to compute
     * the entire sequence up to that point.
     *
     * This is the Infinity Series binary trick. Steps:
     *
     * 1. Convert the integer n to binary string
     * 2. Split the string and map as an Array of 1s and 0s
     * 3. Loop thru the digits, summing the 1s digits, and changing the negative/positve
     *    polarity **at each step** when a 0 is encounterd
     *
     * @param index the 0-based index of the infinity series
     * @returns the value in the infinity series at the given index.
     */
    static norgardInteger(index: number) {
        let binaryDigits = index.toString(2).split("").map(bit => parseInt(bit));

        return binaryDigits.reduce((integer, digit) => {
            if (digit == 1) {
                integer += 1;
            } else {
                integer *= -1;
            }
            return integer;
        }, 0);
    }
}
