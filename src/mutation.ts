import * as helpers from "./helpers";
import { TblswvsError } from "./tblswvs_error";
import { MelodicVector } from "./melodic_vector";
import { Melody } from "./melody";

export class Mutation {

    static transposeDown2(inputMelody: Melody): Melody {
        return new MelodicVector([-2], "scale").applyTo(inputMelody);
    }


    static reverse(inputMelody: Melody): Melody {
        return new Melody(inputMelody.notes.slice().reverse(), inputMelody.key);
    }


    static rotateLeftThree(inputMelody: Melody): Melody {
        return new Melody(helpers.rotate(inputMelody.notes.slice(), -3), inputMelody.key);
    }


    static sort(inputMelody: Melody): Melody {
        return new Melody(inputMelody.notes.slice().sort((a, b) => a.midi - b.midi));
    }


    static reverseSort(inputMelody: Melody): Melody {
        return new Melody(inputMelody.notes.slice().sort((a, b) => b.midi - a.midi));
    }
}
