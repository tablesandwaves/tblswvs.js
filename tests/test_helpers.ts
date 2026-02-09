import { Key } from "../src/key";
import { MelodicVector } from "../src/melodic_vector";
import { Melody } from "../src/melody";

const fs = require("fs");
const path = require("path");


export function getFileContents(mocksPath: string) {
    let filepath = path.resolve(__dirname, "support", mocksPath);
    return fs.readFileSync(filepath, "utf8");
}


export function isSelfReplicatingAt(sequence: (number|string)[], ratio: number): boolean {
    for (let i = 0, replicatingI = 0; replicatingI < sequence.length; i++, replicatingI += ratio)
        if (sequence[replicatingI] !== sequence[i])
            return false;

    return true;
}


export const fileContentsAsMidiNumbers = (mocksPath: string) => {
    return getFileContents(mocksPath)
                .trim()
                .split(/\s+/)
                .map((d: string) => Number.isNaN(parseInt(d)) ? -1 : parseInt(d));
}


export const vectorShiftNotesDegrees = (key: Key, scaleDegrees: number[], vectorShifts: number[], vectorShiftMode: ("scale"|"midi")) => {
    const vector = new MelodicVector(vectorShifts, vectorShiftMode);
    const melody = new Melody(notesForScaleDegrees(scaleDegrees, key), key);
    const transformedMelody = vector.applyTo(melody);
    return [
        transformedMelody.notes.map(n => n.scaleDegree),
        transformedMelody.notes.map(n => n.midi)
    ];
}


export const notesForScaleDegrees = (scaleDegrees: number[], key: Key) => {
    return scaleDegrees.map(d => {
        return {...key.degree(d)}
    });
}
