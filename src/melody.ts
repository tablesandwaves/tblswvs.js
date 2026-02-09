import { TblswvsError } from "./tblswvs_error";
import * as helpers from "./helpers";
import { note } from "./note_data";
import { Rhythm } from "./rhythm";
import { Key } from "./key";


/**
 * The Melody class represents the primary melodic object. A melody has steps that are intended to represet
 * a sequence of notes and rests.
 */
export class Melody {
    notes: note[];
    key?: Key;


    constructor(notes: note[], key?: Key) {
        this.notes = notes;
        if (key != undefined) {
            this.key = key;
            notes.forEach(note => {
                if (note.note != "rest" && note.scaleDegree == undefined) {
                    const scaleNoteIndex = key.scaleNotes.indexOf(key.midi2note(note.midi).replace(/\d+/, ""));
                    if (scaleNoteIndex != -1) note.scaleDegree = scaleNoteIndex + 1;
                }
            });
        }
    }


    /**
     * Clone this melody.
     *
     * @returns a new copy of this object.
     */
    clone() {
        return new Melody(this.notes.slice(), this.key);
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
        const steps = sequences.map(s => s.notes).flat();
        return new Melody(steps, sequences[0].key);
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

        const sequence = new Array(length * ratio)
            .fill(this.notes.map((_, i) => i))
            .flat()
            .slice(0, length);

        for (let i = 0, j = 0; i < sequence.length; i++) {
            if (i % ratio === 0) {
                sequence[i] = sequence[j];
                j++;
            }
        }

        let melody = this.clone();
        melody.notes = sequence.map(index => this.notes[index]);
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
        let sequence = new Array();

        for (let i = 1; i <= this.notes.length; i++) {
            let rhythmSteps = new Array(i).fill(1);
            rhythmSteps.push(0);
            let length = this.notes.length * (i + 1);
            let rhythm = new Rhythm(rhythmSteps, "wrap", length);

            rhythm.applyTo(this).notes.forEach(step => sequence.push(step));
        }
        let countedMelody = this.clone();
        countedMelody.notes = sequence;

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
        let turnAroundStep = this.notes.length % 2 == 0 ? this.notes.length / 2 + 1 : Math.ceil(this.notes.length / 2);
        let steps = this.notes.reduce((previous, current, i) => {
            let segment = new Array(turnAroundStep).fill(-1).map((_, j) => this.notes[(j + i) % this.notes.length]);
            previous.push(segment);
            previous.push(segment.slice(1, turnAroundStep).reverse());
            return previous;
        }, new Array()).flat();

        return new Melody(steps, this.key);
    }


    /**
     * Generate the Norgard infinity series sequence.
     *
     * @param seed the sequence's first two steps, defaults to 0, 1
     * @param size the length of the resulting Meldoy's steps, defaults to 16
     * @param offset offset in the returned sequence from which the sequence starts
     * @returns a Melody with the infinity series as its steps
     */
    static infinitySeries(seed: number[] = [0, 1], size: number = 16, offset: number = 0): number[] {
        const root         = seed[0];
        const step1        = seed[1];
        const seedInterval = step1 - root;

        return Array.from(new Array(size), (n, i) => i + offset).map(step => {
            return root + (Melody.norgardInteger(step) * seedInterval);
        });
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
