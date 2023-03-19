import * as helpers from "./helpers";
import { TblswvsError } from "./tblswvs_error";
import { MelodicVector } from "./melodic_vector";
import { Melody } from "./melody";
import { note } from "./note_data";

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


    static invert(inputMelody: Melody): Melody {
        if (inputMelody.key == undefined) {
            throw new TblswvsError(helpers.KEY_REQUIRED_FOR_MUTATION);
        } else {
            return new Melody(
                inputMelody.notes.map((note: note) => {
                    // This should not be necessary because of the check for the input melody's key.
                    // All melodies with a key have notes with scale degrees assigned.
                    let scaleDegree = note.scaleDegree ? note.scaleDegree : 1;
                    return (inputMelody.key != undefined)
                            ? { ...inputMelody.key.degreeInversion(scaleDegree) }
                            : { octave: 0, note: "", midi: 0}
                }),
                inputMelody.key
            );
        }
    }


    static invertReverse(inputMelody: Melody): Melody {
        return new Melody(
            Mutation.invert(inputMelody).notes.slice().reverse(),
            inputMelody.key
        )
    }
}
