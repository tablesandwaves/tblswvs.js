import { Sequence } from "./sequence";
import { MusicalSymbol } from "./musical_symbol";
import { TblswvsError } from "./tblswvs_error";
import * as helpers from "./helpers";


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
}
