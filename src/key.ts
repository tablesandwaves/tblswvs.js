import { Mode, Scale } from "./mode";
import { chromaticScale, noteData } from "./note_data";


export class Key {
    scale:      Scale;
    mode:       Mode;
    tonic:      string;
    midiTonic:  number;
    octave:     number;
    scaleNotes: string[];


    constructor(scale: Scale, tonic: (number | string)) {
        this.scale = scale;
        this.mode  = Mode.get(scale);
        if (typeof tonic == "string") {
            this.tonic = tonic;
            this.midiTonic = chromaticScale.indexOf(tonic);
            this.octave = 1;
        } else {
            this.tonic = chromaticScale[tonic % 12];
            this.midiTonic = tonic % 12;
            this.octave = noteData[tonic].octave;
        }
        this.scaleNotes = Mode.getScaleNotes(this.tonic, this.scale);
    }


    degree(d: number) {
        // The degree octave may start higher than the current key's octave (e.g., the 9th in a diatonic scale)
        let degreeOctave = this.octave + Math.floor((d - 1) / this.scaleNotes.length);
        let degree = noteData[this.mode.scaleOffsets[(d - 1) % this.scaleNotes.length] + this.midiTonic + (degreeOctave * 12) + 24];
        // Reset the generic note to the scale notes to correctly identify when a scale degree should be a flat, rather than
        // the default sharp for noteData.
        degree.note = this.scaleNotes[(d - 1) % this.scaleNotes.length];
        return degree;
    }
}
