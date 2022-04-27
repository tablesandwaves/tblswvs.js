import { Sequence } from "./sequence";
import { MusicalSymbol } from "./musical_symbol";
import { TblswvsError } from "./tblswvs_error";
import * as helpers from "./helpers";
import { Rhythm } from "./rhythm";


export enum MelodyType {
    MIDI    = "MIDI",
    Degrees = "Scale Degrees"
}


export class Melody implements Sequence {
    steps: MusicalSymbol[];
    restSymbol: string | number;
    melodicMode: MelodyType;


    constructor(steps?: MusicalSymbol[], restSymbol?: number | string, mode?: MelodyType) {

        this.steps = steps === undefined ? new Array<MusicalSymbol>() : steps;
        this.restSymbol = restSymbol === undefined ? 0 : restSymbol;
        this.melodicMode = mode == undefined ? MelodyType.Degrees : mode;
    }


    clone() {
        return new Melody(this.steps, this.restSymbol, this.melodicMode);
    }


    values() {
        return this.steps.map(step => step.value);
    }


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
        sequence[0] = this.steps[0].value;
        sequence[1] = this.steps[1].value;

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
            nextNote = this.steps[count % this.steps.length].value;
            nextEmpty = sequence.findIndex(note => note == -1);
            if (nextEmpty != -1) sequence[nextEmpty] = nextNote;
            count++;
        } while (nextEmpty != -1);

        let melody = this.clone();
        melody.steps = sequence.map(number => new MusicalSymbol(number));
        return melody;
    }


    counted(): Melody {
        let sequence = new Array<MusicalSymbol>();

        for (let i = 1; i <= this.steps.length; i++) {
            let rhythmSteps = new Array(i).fill(1);
            rhythmSteps.push(0);
            let length = this.steps.length * (i + 1);
            let rhythm = new Rhythm(rhythmSteps, "wrap", length);

            rhythm.applyTo(this).steps.forEach(musicalSymbol => sequence.push(musicalSymbol));
        }
        let countedMelody = this.clone();
        countedMelody.steps = sequence;

        return countedMelody;
    }
}
