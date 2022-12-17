import { Mode, Scale } from "./mode";
import { note, chromaticScale, noteData, scaleNoteCandidates, abcNotesMidiOrder } from "./note_data";
import * as helpers from "./helpers";


export class Key {
    scale:      Scale;
    scaleName:  string;
    name:       string;
    mode:       Mode;
    tonic:      string;
    midiTonic:  number;
    octave:     number;
    scaleNotes: string[];


    constructor(tonic: (number | string), scale: Scale) {
        this.scale = scale;
        this.mode  = new Mode(scale);
        if (typeof tonic == "string") {
            this.tonic = tonic;
            this.midiTonic = chromaticScale.indexOf(tonic);
            this.octave = 1;
        } else {
            this.tonic = chromaticScale[tonic % 12];
            this.midiTonic = tonic % 12;
            this.octave = noteData[tonic].octave;
        }
        this.scaleName = Scale[scale];
        this.name = `${this.tonic} ${this.scaleName}`
        this.scaleNotes = this.#calculateScaleNotes();
    }


    degree(d: number): note {
        // The degree octave may start higher than the current key's octave (e.g., the 9th in a diatonic scale)
        let degreeOctave = this.octave + Math.floor((d - 1) / this.scaleNotes.length);
        let degree = noteData[this.mode.scaleOffsets[(d - 1) % this.scaleNotes.length] + this.midiTonic + (degreeOctave * 12) + 24];
        // Reset the generic note to the scale notes to correctly identify when a scale degree should be a flat, rather than
        // the default sharp for noteData.
        degree.note = this.scaleNotes[(d - 1) % this.scaleNotes.length];
        return degree;
    }


    midi2note(midiNoteNumber: number): string {
        const normalizedNumber = midiNoteNumber % 12;
        const normalizedIndex  = this.mode.scaleOffsets.indexOf(normalizedNumber);
        if (normalizedIndex != -1) {
            return this.scaleNotes[normalizedIndex] + noteData[midiNoteNumber].octave;
        } else {
            let note = noteData[midiNoteNumber].note;
            const nearestNote = this.scaleNotes.find(n => n[0] == note[0])
            note += (nearestNote != undefined && nearestNote.length == 2) ? "♮" : "";
            return note + noteData[midiNoteNumber].octave;
        }
    }


    #calculateScaleNotes(): string[] {
        const rotatedAbsolute = helpers.rotate(scaleNoteCandidates, -scaleNoteCandidates.findIndex(n => n.includes(this.tonic)));
        let   scaleAbcNotes   = helpers.rotate(abcNotesMidiOrder, -abcNotesMidiOrder.indexOf(this.tonic[0]));

        if (this.mode.scaleDegreeMapping.length != 0) {
            scaleAbcNotes = this.mode.scaleDegreeMapping.map(d => scaleAbcNotes[Math.floor(d) - 1]);
        }

        return scaleAbcNotes.map((n, i) => {
            const absoluteIndex = this.mode.scaleOffsets[i];
            return rotatedAbsolute[absoluteIndex].find((sn: string[]) => sn[0] == n);
        });
    }
}
