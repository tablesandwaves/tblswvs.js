import * as helpers from "./helpers";


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
    scale: Scale;
    name: string;
    stepOffsets: number[];
    scaleOffsets: number[];
    chordQualities: string[];
    scaleDegreeMapping: number[];


    private static readonly MAJOR_STEP_OFFSETS   = [2, 2, 1, 2, 2, 2, 1];
    private static readonly WHOLE_TONE_OFFSETS   = [2, 2, 2, 2, 2, 2];
    private static readonly CHROMATIC_OFFSETS    = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    private static readonly GS_OFFSETS           = [1, 2, 1, 1, 3, 1, 3];
    private static readonly CHORD_INTERVAL_MAP: Record<string, string> = {
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


    constructor(scale: Scale) {
        this.scale = scale;
        this.name = Scale[scale];

        [this.stepOffsets, this.scaleDegreeMapping] = this.#offsetsScaleDegreeMapping(scale);
        this.scaleOffsets = Mode.cummulativeOffsets(this.stepOffsets);
        this.chordQualities = Mode.chordQualities(this.stepOffsets);
    }


    #offsetsScaleDegreeMapping(scale: Scale): number[][] {
        let _scale, stepOffsets, scaleDegreeMapping: number[] = new Array();

        _scale = (scale == Scale.Major || scale == Scale.MajPentatonic) ? Scale.Ionian : scale;
        _scale = (scale == Scale.Minor || scale == Scale.MinPentatonic) ? Scale.Aeolian : scale;

        stepOffsets = helpers.rotate(Mode.MAJOR_STEP_OFFSETS, -_scale);
        if (scale == Scale.MajPentatonic) {
            stepOffsets.splice(2, 2, 3);
            stepOffsets.splice(-2, 2, 3);
            scaleDegreeMapping = [1, 2, 3, 5, 6];
        } else if (scale == Scale.MinPentatonic) {
            stepOffsets.splice(0, 2, 3);
            stepOffsets.splice(-3, 2, 3);
            scaleDegreeMapping = [1, 3, 4, 5, 7];
        } else if (scale == Scale.WholeTone) {
            stepOffsets = Mode.WHOLE_TONE_OFFSETS;
            scaleDegreeMapping = [1, 2, 3, 4, 5, 6];
        } else if (scale == Scale.Chromatic) {
            stepOffsets = Mode.CHROMATIC_OFFSETS;
            scaleDegreeMapping = [1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7];
        } else if (scale == Scale.GS) {
            stepOffsets = Mode.GS_OFFSETS;
        }

        return [stepOffsets, scaleDegreeMapping];
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

            chordSteps.push(Mode.CHORD_INTERVAL_MAP[[firstInterval, secondInterval].join(":")]);
            return chordSteps;
        }, [])
    }
}
