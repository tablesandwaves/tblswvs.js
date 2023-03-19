import * as helpers from "./helpers";
import { TblswvsError } from "./tblswvs_error";
import { MelodicVector } from "./melodic_vector";
import { Melody } from "./melody";

export class Mutation {

    static transposeDown2(inputMelody: Melody): Melody {
        return new MelodicVector([-2], "scale").applyTo(inputMelody);
    }
}
