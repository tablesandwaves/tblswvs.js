import * as helpers from "./helpers";
import { TblswvsError } from "./tblswvs_error";
import { MelodicVector } from "./melodic_vector";
import { Melody } from "./melody";
import { note } from "./note_data";


export class Mutation {
    static functionMap: Map<string, Function> = new Map([
        ["transposeDown2",  Mutation.transposeDown2],
        ["reverse",         Mutation.reverse],
        ["rotateLeftThree", Mutation.rotateLeftThree],
        ["sort",            Mutation.sort],
        ["reverseSort",     Mutation.reverseSort],
        ["invert",          Mutation.invert],
        ["invertReverse",   Mutation.invertReverse],
        ["bitFlip",         Mutation.bitFlip]
    ]);


    static random(inputMelody: Melody, algorithms?: string[]): Melody {
        if (algorithms == undefined)
            algorithms = Object.getOwnPropertyNames(Mutation).filter(func => !["length", "name", "prototype"].includes(func));

        const algorithm = this.functionMap.get(algorithms[Math.floor(Math.random() * algorithms.length)]);
        if (algorithm != undefined)
            return algorithm(inputMelody);
        else
            return inputMelody;
    }


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
        return new Melody(inputMelody.notes.slice().sort((a, b) => a.midi - b.midi), inputMelody.key);
    }


    static reverseSort(inputMelody: Melody): Melody {
        return new Melody(inputMelody.notes.slice().sort((a, b) => b.midi - a.midi), inputMelody.key);
    }


    static invert(inputMelody: Melody): Melody {
        if (inputMelody.key == undefined) {
            throw new TblswvsError(helpers.KEY_REQUIRED_FOR_MUTATION);
        } else {
            const key = inputMelody.key;
            return new Melody(
                inputMelody.notes.map((note: note) => {
                    // This should not be necessary because of the check for the input melody's key.
                    // All melodies with a key have notes with scale degrees assigned.
                    let scaleDegree = note.scaleDegree ? note.scaleDegree : 1;
                    return { ...key.degreeInversion(scaleDegree) };
                }),
                key
            );
        }
    }


    static invertReverse(inputMelody: Melody): Melody {
        return new Melody(
            Mutation.invert(inputMelody).notes.slice().reverse(),
            inputMelody.key
        )
    }


    static bitFlip(inputMelody: Melody): Melody {
        if (inputMelody.key == undefined) {
            throw new TblswvsError(helpers.KEY_REQUIRED_FOR_MUTATION);
        } else {
            const key = inputMelody.key;

            const melodyAsScaleDegrees = inputMelody.notes.map(n => n.scaleDegree ? n.scaleDegree : 1);

            let popMutations = new Array(melodyAsScaleDegrees.length).fill(0);
            let mutations    = new Array(Math.ceil(melodyAsScaleDegrees.length * 0.3)).fill(1);
            popMutations.splice(0, mutations.length, ...mutations);
            helpers.shuffle(popMutations);

            const largestInterval = melodyAsScaleDegrees.map(scaleDegree => Math.abs(scaleDegree)).slice().sort().reverse()[0];
            const binaryPadding   = Number(largestInterval).toString(2).length;

            return new Melody(inputMelody.notes.map((note, i) => {
                if (popMutations[i] == 1) {
                    const sign = note.scaleDegree !== undefined && note.scaleDegree < 0 ? -1 : 1;

                    // Convert the scale degree to binary, padding it to the number of digits that would fit the largest interval
                    let binaryDigits = Number(Math.abs(note.scaleDegree == undefined ? 1 : note.scaleDegree)).toString(2).padStart(binaryPadding, "0").split("").map(s => parseInt(s));

                    // Choose a random bit and flip it (0 => 1, 1 => 0)
                    let flipBit = Math.floor(Math.random() * binaryPadding);
                    binaryDigits[flipBit] = 1 - binaryDigits[flipBit];

                    // Return the new number based on the mutated gene. Note that a tblswvs scale degree may not equal 0.
                    let newScaleDegree  = parseInt(binaryDigits.join(""), 2) * sign;
                    newScaleDegree      = newScaleDegree == 0 ? -1 : newScaleDegree;
                    let mutatedNoteData = { ...key.degree(newScaleDegree) };

                    mutatedNoteData.midi += ((note.octave - key.octave) * 12);
                    return mutatedNoteData;
                } else {
                    return note;
                }
            }), key);
        }
    }
}
