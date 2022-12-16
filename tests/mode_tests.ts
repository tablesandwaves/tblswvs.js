import { expect } from "chai";

import { Mode, Scale } from "../src/mode";


describe("Mode", () => {
    describe("the base western major scale", () => {
        it("has step offsets", () => {
            expect(Mode.MAJOR_STEP_OFFSETS).to.have.ordered.members([2, 2, 1, 2, 2, 2, 1]);
        });

        describe("other western modes can be derived", () => {
            it("Major/Ionian", () => {
                const expectedOffsets = [0, 2, 4, 5, 7, 9, 11];
                const expectedQualities = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];

                const major = Mode.get(Scale.Major);
                expect(major.scaleOffsets).to.have.ordered.members(expectedOffsets);
                expect(major.chordQualities).to.have.ordered.members(expectedQualities);

                const ionian = Mode.get(Scale.Ionian);
                expect(ionian.scaleOffsets).to.have.ordered.members(expectedOffsets);
                expect(ionian.chordQualities).to.have.ordered.members(expectedQualities);
            });

            it("Minor/Aeolian", () => {
                const expectedOffsets = [0, 2, 3, 5, 7, 8, 10];
                const expectedQualities = ["m", "dim", "M", "m", "m", "M", "M"];

                const minor = Mode.get(Scale.Minor);
                expect(minor.scaleOffsets).to.have.ordered.members(expectedOffsets);
                expect(minor.chordQualities).to.have.ordered.members(expectedQualities);

                const aeolian = Mode.get(Scale.Aeolian);
                expect(aeolian.scaleOffsets).to.have.ordered.members(expectedOffsets);
                expect(aeolian.chordQualities).to.have.ordered.members(expectedQualities);
            });

            it("Dorian", () => {
                const dorianMode = Mode.get(Scale.Dorian);
                expect(dorianMode.scaleOffsets).to.have.ordered.members([0, 2, 3, 5, 7, 9, 10]);
                expect(dorianMode.chordQualities).to.have.ordered.members(['m', 'm', 'M', 'M', 'm', 'dim', 'M']);
            });

            it("Phrygian", () => {
                const phrygianMode = Mode.get(Scale.Phrygian);
                expect(phrygianMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 5, 7, 8, 10]);
                expect(phrygianMode.chordQualities).to.have.ordered.members(["m", "M", "M", "m", "dim", "M", "m"]);
            });

            it("Lydian", () => {
                const lydianMode = Mode.get(Scale.Lydian);
                expect(lydianMode.scaleOffsets).to.have.ordered.members([0, 2, 4, 6, 7, 9, 11]);
                expect(lydianMode.chordQualities).to.have.ordered.members(["M", "M", "m", "dim", "M", "m", "m"]);
            });

            it("Mixolydian", () => {
                const mixolydianMode = Mode.get(Scale.Mixolydian);
                expect(mixolydianMode.scaleOffsets).to.have.ordered.members([0, 2, 4, 5, 7, 9, 10]);
                expect(mixolydianMode.chordQualities).to.have.ordered.members(["M", "m", "dim", "M", "m", "m", "M"]);
            });

            it("Locrian", () => {
                const locrianMode = Mode.get(Scale.Locrian);
                expect(locrianMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 5, 6, 8, 10]);
                expect(locrianMode.chordQualities).to.have.ordered.members(["dim", "M", "m", "m", "M", "M", "m"]);
            });

            it("GS", () => {
                const gsMode = Mode.get(Scale.GS);
                expect(gsMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 4, 5, 8, 9]);
                expect(gsMode.chordQualities).to.have.ordered.members(["m5bb", "m", "sus25b", "aug", "aug", "M", "M"]);
            });
        });
    });

    describe("the non-heptatonic scales can be computed", () => {
        it("Pentatonic Major", () => {
            const pentMaj = Mode.get(Scale.MajPentatonic);
            expect(pentMaj.scaleOffsets).to.have.ordered.members([0, 2, 4, 7, 9]);
            expect(pentMaj.chordQualities).to.have.ordered.members(["m/3", "sus2/2", "sus2/2", "M/5", "sus2/2"]);
        });

        it("Pentatonic Minor", () => {
            const pentMin = Mode.get(Scale.MinPentatonic);
            expect(pentMin.scaleOffsets).to.have.ordered.members([0, 3, 5, 7, 10]);
            expect(pentMin.chordQualities).to.have.ordered.members(["sus2/2", "m/3", "sus2/2", "sus2/2", "M/5"]);
        });

        it("Whole Tone", () => {
            const wholeTone = Mode.get(Scale.WholeTone);
            expect(wholeTone.scaleOffsets).to.have.ordered.members([0, 2, 4, 6, 8, 10]);
            expect(wholeTone.chordQualities).to.have.ordered.members(["aug", "aug", "aug", "aug", "aug", "aug"]);
        });

        it("Chromatic", () => {
            const chromatic = Mode.get(Scale.Chromatic);
            const expectedOffsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const expectedQualities = ["WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT"];
            expect(chromatic.scaleOffsets).to.have.ordered.members(expectedOffsets);
            expect(chromatic.chordQualities).to.have.ordered.members(expectedQualities);
        });
    });


    describe("when identifying scale notes", () => {
        it("can find scale notes with no sharps/flats", () => {
            expect(Mode.getScaleNotes("C", Scale.Major)).to.have.ordered.members(["C", "D", "E", "F", "G", "A", "B"]);
            expect(Mode.getScaleNotes("A", Scale.Minor)).to.have.ordered.members(["A", "B", "C", "D", "E", "F", "G"]);
        });

        it("can find scale notes with a sharp", () => {
            expect(Mode.getScaleNotes("G", Scale.Major)).to.have.ordered.members(["G", "A", "B", "C", "D", "E", "F#"]);
        });

        it("can find scale notes with flats", () => {
            expect(Mode.getScaleNotes("C", Scale.Minor)).to.have.ordered.members(["C", "D", "Eb", "F", "G", "Ab", "Bb"]);
        });

        it("can find scale notes with double sharps", () => {
            expect(Mode.getScaleNotes("G#", Scale.Major)).to.have.ordered.members(["G#", "A#", "B#", "C#", "D#", "E#", "Fx"]);
        });

        it("can find scale notes for pentatonics (diatonic skips)", () => {
            expect(Mode.getScaleNotes("F#", Scale.MajPentatonic)).to.have.ordered.members(["F#", "G#", "A#", "C#", "D#"]);
            expect(Mode.getScaleNotes("E", Scale.MinPentatonic)).to.have.ordered.members(["E", "G", "A", "B", "D"]);
        });

        it("can find scale notes for Whole Tone", () => {
            expect(Mode.getScaleNotes("C", Scale.WholeTone)).to.have.ordered.members(["C", "D", "E", "F#", "G#", "A#"]);
        });

        it("can find scale notes for Chromatic", () => {
            const expected = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            expect(Mode.getScaleNotes("C", Scale.Chromatic)).to.have.ordered.members(expected);
        });

        it("can find scale notes for GS", () => {
            const expected = ["C", "Db", "Eb", "Fb", "Gbb", "Ab", "Bbb"];
            expect(Mode.getScaleNotes("C", Scale.GS)).to.have.ordered.members(expected);
        });
    });
});
