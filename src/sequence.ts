import { TblswvsError } from "./tblswvs_error";
import * as helpers from "./helpers";

export enum SequenceMode {
    MIDI = "MIDI",
    Degrees = "Scale Degrees"
}

export class Sequence {
    steps: Array<number>;
    restSymbol: string | number;
    mode: SequenceMode;


    constructor(steps?: number[] | string[], restSymbol?: number | string, mode?: SequenceMode) {

        this.steps = steps === undefined ? new Array() : steps;
        this.restSymbol = restSymbol === undefined ? 0 : restSymbol;
        this.mode = mode == undefined ? SequenceMode.Degrees : mode;
    }


    clone() {
        return new Sequence(this.steps, this.restSymbol, this.mode);
    }


    static newFrom(sequences: Sequence[]) {
        const restSymbols = sequences.map(s => s.restSymbol).filter(helpers.unique);
        const modes       = sequences.map(s => s.mode).filter(helpers.unique);
        if (restSymbols.length > 1 || modes.length > 1)
            throw new TblswvsError(helpers.INCOMPATIBLE_SEQ_MSG);

        const steps = sequences.map(s => s.steps).flat();
        return new Sequence(steps, sequences[0].restSymbol, sequences[0].mode);
    }
}
