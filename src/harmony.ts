import * as helpers from "./helpers";
import { scaleNoteCandidates } from "./note_data";


export enum Scale {
    Ionian,
    Dorian,
    Phrygian,
    Lydian,
    Mixolydian,
    Aeolian,
    Locrian,
    Major,
    Minor,
    MajPentatonic,
    MinPentatonic,
    WholeTone,
    Chromatic,
    GS
}


export class Mode {
    scaleOffsets: number[];
    chordQualities: string[];
    scaleDegreeMapping: (number[] | undefined);


    static MAJOR_STEP_OFFSETS   = [2, 2, 1, 2, 2, 2, 1];
    static WHOLE_TONE_OFFSETS   = [2, 2, 2, 2, 2, 2];
    static CHROMATIC_OFFSETS    = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    static GS_OFFSETS           = [1, 2, 1, 1, 3, 1, 3];
    static ABC_NOTES_MIDI_ORDER = ["C", "D", "E", "F", "G", "A", "B"];


    constructor(scaleOffsets: number[], chordQualities: string[], scaleDegreeMapping?: number[]) {
        this.scaleOffsets   = scaleOffsets;
        this.chordQualities = chordQualities;
        this.scaleDegreeMapping = scaleDegreeMapping;
    }


    static get(mode: Scale): Mode {
        let _mode, offsets, scaleDegreeMapping;

        _mode = (mode == Scale.Major || mode == Scale.MajPentatonic) ? Scale.Ionian : mode;
        _mode = (mode == Scale.Minor || mode == Scale.MinPentatonic) ? Scale.Aeolian : mode;

        offsets = helpers.rotate(Mode.MAJOR_STEP_OFFSETS, -_mode);
        if (mode == Scale.MajPentatonic) {
            offsets.splice(2, 2, 3);
            offsets.splice(-2, 2, 3);
            scaleDegreeMapping = [1, 2, 3, 5, 6];
        } else if (mode == Scale.MinPentatonic) {
            offsets.splice(0, 2, 3);
            offsets.splice(-3, 2, 3);
            scaleDegreeMapping = [1, 3, 4, 5, 7];
        } else if (mode == Scale.WholeTone) {
            offsets = Mode.WHOLE_TONE_OFFSETS;
            scaleDegreeMapping = [1, 2, 3, 4, 5, 6];
        } else if (mode == Scale.Chromatic) {
            offsets = Mode.CHROMATIC_OFFSETS;
            scaleDegreeMapping = [1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7];
        } else if (mode == Scale.GS) {
            offsets = Mode.GS_OFFSETS;
        }

        return new Mode(Mode.cummulativeOffsets(offsets), Mode.chordQualities(offsets), scaleDegreeMapping);
    }


    static getScaleNotes(tonic: string, scale: Scale): string[] {
        const mode            = Mode.get(scale);
        const rotatedAbsolute = helpers.rotate(scaleNoteCandidates, -scaleNoteCandidates.findIndex(n => n.includes(tonic)));
        let   scaleAbcNotes   = helpers.rotate(Mode.ABC_NOTES_MIDI_ORDER, -Mode.ABC_NOTES_MIDI_ORDER.indexOf(tonic[0]));

        if (mode.scaleDegreeMapping != undefined) {
            scaleAbcNotes = mode.scaleDegreeMapping.map(d => scaleAbcNotes[Math.floor(d) - 1]);
        }

        return scaleAbcNotes.map((n, i) => {
            const absoluteIndex = mode.scaleOffsets[i];
            return rotatedAbsolute[absoluteIndex].find((sn: string[]) => sn[0] == n);
        });
    }


    protected static cummulativeOffsets(stepOffsets: number[]) {
        return stepOffsets.reduce((cummulativeOffsets: number[], _, i, arr) => {
            cummulativeOffsets.push(arr.slice(0, i).reduce((sum, intv) => sum += intv, 0));
            return cummulativeOffsets;
        }, []);
    }


    static CHORD_INTERVAL_MAP: Record<string, string> = {
        "4:3": "M",
        "3:4": "m",
        "3:3": "dim",
        "4:4": "aug",
        "4:5": "m/3",
        "2:4": "sus25b",
        "5:5": "sus2/2",
        "5:4": "M/5",
        "2:2": "WT",
        "3:2": "m5bb"
    }


    protected static chordQualities(stepOffsets: number[]) {

        return stepOffsets.reduce((chordSteps: string[], _, i, arr) => {
            const current        = helpers.rotate(arr, -i);
            const firstInterval  = current.slice(0, 2).reduce((a, b) => a + b, 0);
            const secondInterval = current.slice(2, 4).reduce((a, b) => a + b, 0);

            chordSteps.push(Mode.CHORD_INTERVAL_MAP[[firstInterval, secondInterval].join(":")]);
            return chordSteps;
        }, [])
    }
}
