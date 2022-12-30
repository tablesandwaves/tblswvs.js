import { Mode, Scale } from "./mode";
import * as noteData from "./note_data";
import * as helpers from "./helpers";
import { TblswvsError } from "./tblswvs_error";


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
            this.midiTonic = noteData.chromaticScale.indexOf(tonic);
            this.octave = 1;
        } else {
            this.tonic = noteData.chromaticScale[tonic % 12];
            this.midiTonic = tonic % 12;
            this.octave = noteData.noteData[tonic].octave;
        }
        this.scaleName = Scale[scale];
        this.name = `${this.tonic} ${this.scaleName}`
        this.scaleNotes = this.#calculateScaleNotes();
    }


    degree(d: number): noteData.note {
        if (d == 0) throw new TblswvsError(helpers.SCALE_DEGREE_ERROR);

        if (d < 0) return this.#negativeDegree(d);

        // The degree octave may start higher than the current key's octave (e.g., the 9th in a diatonic scale)
        let degreeOctave = this.octave + Math.floor((d - 1) / this.scaleNotes.length);
        let degree = noteData.noteData[this.mode.scaleOffsets[(d - 1) % this.scaleNotes.length] + this.midiTonic + (degreeOctave * 12) + 24];
        // Reset the generic note to the scale notes to correctly identify when a scale degree should be a flat, rather than
        // the default sharp for noteData.
        degree.note = this.scaleNotes[(d - 1) % this.scaleNotes.length];
        return degree;
    }


    #negativeDegree(d: number): noteData.note {

        // For negative indices, start by getting the step offsets in reverse order...
        let revCopy  = this.mode.stepOffsets.slice().reverse();
        // Then determine how many copies of the array are needed to index the current scale degree
        // (e.g., -8 for C Major would be the second B, so copies should be 2)
        let copies   = Math.ceil(-d / revCopy.length);
        // Create a version of the reversed step offsets that can reach the scale degree needed.
        let expanded = new Array(copies).fill(revCopy).flat();

        // Finally, subtract negative offsets from the current Key's root.
        return noteData.noteData[this.octave * 12 + this.midiTonic + 24 - expanded.slice(0, -d).reduce((total, offset) => total += offset, 0)];
    }


    chord(degree: number, type: string, octaveTransposition?: number): noteData.chord {
        let quality = (type == "T") ? this.mode.chordQualities[degree - 1] : type;

        /*
         * octaveTransposition: the calling client may request transposition (-/+)
         * this.midiTonic: scale pitch class (0-11)
         * this.octave * 12: the Key has a default lowest octave
         * + 24: lowest MIDI octave, -2, means this.octave*12 could be as low as -24, which should be brought up to MIDI note 0
         */
        let midiTransposition = (octaveTransposition == undefined ? 0 : octaveTransposition * 12) + this.midiTonic + (this.octave * 12) + 24;

        let midi = noteData.chordTypes[quality].intervals.reduce((midiNotes: number[], intv: number) => {
            midiNotes.push(intv + this.mode.scaleOffsets[degree - 1] + midiTransposition);
            return midiNotes;
        }, []);

        return {
            midi: midi,
            quality: quality,
            root: this.#calculateChordRoot(midi, quality),
            degree: this.#calculateChordDegree(quality, degree),
            keyTransposition: octaveTransposition == undefined ? 0 : octaveTransposition
        }
    }


    #calculateChordRoot(chordMidi: number[], chordQuality: string): string {
        let inversion = chordQuality.split("/")[1];
        if (inversion == undefined) {
            return noteData.noteData[chordMidi[0]].note;
        } else if (inversion == "2" || inversion == "3" || inversion == "4") {
            return noteData.noteData[chordMidi[2]].note;
        } else if (inversion == "5") {
            return noteData.noteData[chordMidi[1]].note;
        } else {
            return noteData.noteData[chordMidi[0]].note;
        }
    }


    #calculateChordDegree(quality: string, degree: number): string {
        if (quality.startsWith("M")) {
            return quality.replace("M", noteData.chordNumeralsMap[degree]);
        } else if (quality.startsWith("m")) {
            return quality.replace("m", noteData.chordNumeralsMap[degree].toLowerCase());
        } else if (quality.startsWith("aug")) {
            return quality.replace("aug", noteData.chordNumeralsMap[degree]) + "+";
        } else if (quality.startsWith("dim")) {
            return quality.replace("dim", noteData.chordNumeralsMap[degree]).toLowerCase() + "o";
        } else if (quality.startsWith("sus2")) {
            return noteData.chordNumeralsMap[degree] + quality;
        } else if (quality.startsWith("sus4")) {
            return quality.replace("sus2", noteData.chordNumeralsMap[degree]) + "sus4";
        } else if (quality.startsWith("WT")) {
            return quality.replace("WT", noteData.chordNumeralsMap[degree]).toLowerCase() + "WT";
        } else {
            return degree + quality;
        }
    }


    midi2note(midiNoteNumber: number): string {
        const normalizedNumber = midiNoteNumber % 12;
        const normalizedIndex  = this.mode.scaleOffsets.indexOf(normalizedNumber);
        if (normalizedIndex != -1) {
            return this.scaleNotes[normalizedIndex] + noteData.noteData[midiNoteNumber].octave;
        } else {
            let note = noteData.noteData[midiNoteNumber].note;
            const nearestNote = this.scaleNotes.find(n => n[0] == note[0])
            note += (nearestNote != undefined && nearestNote.length == 2) ? "♮" : "";
            return note + noteData.noteData[midiNoteNumber].octave;
        }
    }


    #calculateScaleNotes(): string[] {
        const rotatedAbsolute = helpers.rotate(noteData.scaleNoteCandidates, -noteData.scaleNoteCandidates.findIndex(n => n.includes(this.tonic)));
        let   scaleAbcNotes   = helpers.rotate(noteData.abcNotesMidiOrder, -noteData.abcNotesMidiOrder.indexOf(this.tonic[0]));

        if (this.mode.scaleDegreeMapping.length != 0) {
            scaleAbcNotes = this.mode.scaleDegreeMapping.map(d => scaleAbcNotes[Math.floor(d) - 1]);
        }

        return scaleAbcNotes.map((n, i) => {
            const absoluteIndex = this.mode.scaleOffsets[i];
            return rotatedAbsolute[absoluteIndex].find((sn: string[]) => sn[0] == n);
        });
    }
}
