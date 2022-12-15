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
    WholeTone
}


export class Harmony {
    scaleOffsets: number[];
    chordQualities: string[];
    scaleDegreeMapping: (number[] | undefined);


    static MAJOR_STEP_OFFSETS   = [2, 2, 1, 2, 2, 2, 1];
    static WHOLE_TONE_OFFSETS   = [2, 2, 2, 2, 2, 2];
    static ABC_NOTES_MIDI_ORDER = ["C", "D", "E", "F", "G", "A", "B"];


    constructor(scaleOffsets: number[], chordQualities: string[], scaleDegreeMapping?: number[]) {
        this.scaleOffsets   = scaleOffsets;
        this.chordQualities = chordQualities;
        this.scaleDegreeMapping = scaleDegreeMapping;
    }


    static getMode(mode: Scale): Harmony {
        let _mode, offsets, scaleDegreeMapping;

        _mode = (mode == Scale.Major || mode == Scale.MajPentatonic) ? Scale.Ionian : mode;
        _mode = (mode == Scale.Minor || mode == Scale.MinPentatonic) ? Scale.Aeolian : mode;

        offsets = helpers.rotate(Harmony.MAJOR_STEP_OFFSETS, -_mode);
        if (mode == Scale.MajPentatonic) {
            offsets.splice(2, 2, 3);
            offsets.splice(-2, 2, 3);
            scaleDegreeMapping = [1, 2, 3, 5, 6];
        } else if (mode == Scale.MinPentatonic) {
            offsets.splice(0, 2, 3);
            offsets.splice(-3, 2, 3);
            scaleDegreeMapping = [1, 3, 4, 5, 7];
        } else if (mode == Scale.WholeTone) {
            offsets = Harmony.WHOLE_TONE_OFFSETS;
            scaleDegreeMapping = [1, 2, 3, 4, 5, 6];
        }

        return new Harmony(Harmony.cummulativeOffsets(offsets), Harmony.chordQualities(offsets), scaleDegreeMapping);
    }


    static getScaleNotes(tonic: string, scale: Scale): string[] {
        const mode            = Harmony.getMode(scale);
        const rotatedAbsolute = helpers.rotate(scaleNoteCandidates, -scaleNoteCandidates.findIndex(n => n.includes(tonic)));
        let   scaleAbcNotes   = helpers.rotate(Harmony.ABC_NOTES_MIDI_ORDER, -Harmony.ABC_NOTES_MIDI_ORDER.indexOf(tonic[0]));

        if (mode.scaleDegreeMapping != undefined) {
            scaleAbcNotes = mode.scaleDegreeMapping.map(d => scaleAbcNotes[d - 1]);
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


    protected static chordQualities(stepOffsets: number[]) {
        return stepOffsets.reduce((chordSteps: string[], _, i, arr) => {
            const current        = helpers.rotate(arr, -i);
            const firstInterval  = current.slice(0, 2).reduce((a, b) => a + b, 0);
            const secondInterval = current.slice(2, 4).reduce((a, b) => a + b, 0);

            switch([firstInterval, secondInterval].join(":")) {
                case "4:3": {
                    chordSteps.push("M");
                    break;
                }
                case "3:4": {
                    chordSteps.push("m");
                    break;
                }
                case "3:3": {
                    chordSteps.push("dim");
                    break;
                }
                case "4:4": {
                    chordSteps.push("aug");
                    break;
                }
                case "4:5": {
                    chordSteps.push("m/3");
                    break;
                }
                case "5:5": {
                    chordSteps.push("sus2/2");
                    break;
                }
                case "5:4": {
                    chordSteps.push("M/5");
                    break;
                }

            }
            return chordSteps;
        }, [])
    }
}
