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
    MinPentatonic
}


export class Harmony {
    scaleOffsets: number[];
    chordQualities: string[];


    static MAJOR_STEP_OFFSETS = [2, 2, 1, 2, 2, 2, 1];


    constructor(scaleOffsets: number[], chordQualities: string[]) {
        this.scaleOffsets   = scaleOffsets;
        this.chordQualities = chordQualities;
    }


    static getMode(mode: Scale): Harmony {
        let _mode;

        _mode = (mode == Scale.Major || mode == Scale.MajPentatonic) ? Scale.Ionian : mode;
        _mode = (mode == Scale.Minor || mode == Scale.MinPentatonic) ? Scale.Aeolian : mode;

        const offsets = helpers.rotate(Harmony.MAJOR_STEP_OFFSETS, -_mode);
        if (mode == Scale.MajPentatonic) {
            offsets.splice(2, 2, 3);
            offsets.splice(-2, 2, 3);
        } else if (mode == Scale.MinPentatonic) {
            offsets.splice(0, 2, 3);
            offsets.splice(-3, 2, 3);
        }

        return new Harmony(
            Harmony.cummulativeOffsets(offsets),
            Harmony.chordQualities(offsets)
        );
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
