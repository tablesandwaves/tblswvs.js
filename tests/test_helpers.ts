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
    let index = 0;
    let copy = new Array(sequence.length);

    while (copy.findIndex(n => n == undefined) >= 0) {
        copy[index] = sequence[(index * ratio) % sequence.length];
        index += 1;
    }

    return sequence.length === copy.length && sequence.every((value, index) => value === copy[index]);
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
