import { expect } from "chai";

import { Harmony, Scale } from "../src/harmony";


describe("Harmony", () => {
    describe("the base western major scale", () => {
        it("has step offsets", () => {
            expect(Harmony.MAJOR_STEP_OFFSETS).to.have.ordered.members([2, 2, 1, 2, 2, 2, 1]);
        });

        describe("other western modes can be derived", () => {
            it("Major/Ionian", () => {
                const expectedOffsets = [0, 2, 4, 5, 7, 9, 11];
                const expectedQualities = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];

                const major = Harmony.getMode(Scale.Major);
                expect(major.scaleOffsets).to.have.ordered.members(expectedOffsets);
                expect(major.chordQualities).to.have.ordered.members(expectedQualities);

                const ionian = Harmony.getMode(Scale.Ionian);
                expect(ionian.scaleOffsets).to.have.ordered.members(expectedOffsets);
                expect(ionian.chordQualities).to.have.ordered.members(expectedQualities);
            });

            it("Minor/Aeolian", () => {
                const expectedOffsets = [0, 2, 3, 5, 7, 8, 10];
                const expectedQualities = ["m", "dim", "M", "m", "m", "M", "M"];

                const minor = Harmony.getMode(Scale.Minor);
                expect(minor.scaleOffsets).to.have.ordered.members(expectedOffsets);
                expect(minor.chordQualities).to.have.ordered.members(expectedQualities);

                const aeolian = Harmony.getMode(Scale.Aeolian);
                expect(aeolian.scaleOffsets).to.have.ordered.members(expectedOffsets);
                expect(aeolian.chordQualities).to.have.ordered.members(expectedQualities);
            });

            it("Dorian", () => {
                const dorianMode = Harmony.getMode(Scale.Dorian);
                expect(dorianMode.scaleOffsets).to.have.ordered.members([0, 2, 3, 5, 7, 9, 10]);
                expect(dorianMode.chordQualities).to.have.ordered.members(['m', 'm', 'M', 'M', 'm', 'dim', 'M']);
            });

            it("Phrygian", () => {
                const phrygianMode = Harmony.getMode(Scale.Phrygian);
                expect(phrygianMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 5, 7, 8, 10]);
                expect(phrygianMode.chordQualities).to.have.ordered.members(["m", "M", "M", "m", "dim", "M", "m"]);
            });

            it("Lydian", () => {
                const lydianMode = Harmony.getMode(Scale.Lydian);
                expect(lydianMode.scaleOffsets).to.have.ordered.members([0, 2, 4, 6, 7, 9, 11]);
                expect(lydianMode.chordQualities).to.have.ordered.members(["M", "M", "m", "dim", "M", "m", "m"]);
            });

            it("Mixolydian", () => {
                const mixolydianMode = Harmony.getMode(Scale.Mixolydian);
                expect(mixolydianMode.scaleOffsets).to.have.ordered.members([0, 2, 4, 5, 7, 9, 10]);
                expect(mixolydianMode.chordQualities).to.have.ordered.members(["M", "m", "dim", "M", "m", "m", "M"]);
            });

            it("Locrian", () => {
                const locrianMode = Harmony.getMode(Scale.Locrian);
                expect(locrianMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 5, 6, 8, 10]);
                expect(locrianMode.chordQualities).to.have.ordered.members(["dim", "M", "m", "m", "M", "M", "m"]);
            });

            it("GS", () => {
                const gsMode = Harmony.getMode(Scale.GS);
                expect(gsMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 4, 5, 8, 9]);
                expect(gsMode.chordQualities).to.have.ordered.members(["m5bb", "m", "sus25b", "aug", "aug", "M", "M"]);
            });
        });
    });

    describe("the non-heptatonic scales can be computed", () => {
        it("Pentatonic Major", () => {
            const pentMaj = Harmony.getMode(Scale.MajPentatonic);
            expect(pentMaj.scaleOffsets).to.have.ordered.members([0, 2, 4, 7, 9]);
            expect(pentMaj.chordQualities).to.have.ordered.members(["m/3", "sus2/2", "sus2/2", "M/5", "sus2/2"]);
        });

        it("Pentatonic Minor", () => {
            const pentMin = Harmony.getMode(Scale.MinPentatonic);
            expect(pentMin.scaleOffsets).to.have.ordered.members([0, 3, 5, 7, 10]);
            expect(pentMin.chordQualities).to.have.ordered.members(["sus2/2", "m/3", "sus2/2", "sus2/2", "M/5"]);
        });

        it("Whole Tone", () => {
            const wholeTone = Harmony.getMode(Scale.WholeTone);
            expect(wholeTone.scaleOffsets).to.have.ordered.members([0, 2, 4, 6, 8, 10]);
            expect(wholeTone.chordQualities).to.have.ordered.members(["aug", "aug", "aug", "aug", "aug", "aug"]);
        });

        it("Chromatic", () => {
            const chromatic = Harmony.getMode(Scale.Chromatic);
            const expectedOffsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const expectedQualities = ["WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT"];
            expect(chromatic.scaleOffsets).to.have.ordered.members(expectedOffsets);
            expect(chromatic.chordQualities).to.have.ordered.members(expectedQualities);
        });
    });


    describe("when identifying scale notes", () => {
        it("can find scale notes with no sharps/flats", () => {
            expect(Harmony.getScaleNotes("C", Scale.Major)).to.have.ordered.members(["C", "D", "E", "F", "G", "A", "B"]);
            expect(Harmony.getScaleNotes("A", Scale.Minor)).to.have.ordered.members(["A", "B", "C", "D", "E", "F", "G"]);
        });

        it("can find scale notes with a sharp", () => {
            expect(Harmony.getScaleNotes("G", Scale.Major)).to.have.ordered.members(["G", "A", "B", "C", "D", "E", "F#"]);
        });

        it("can find scale notes with flats", () => {
            expect(Harmony.getScaleNotes("C", Scale.Minor)).to.have.ordered.members(["C", "D", "Eb", "F", "G", "Ab", "Bb"]);
        });

        it("can find scale notes with double sharps", () => {
            expect(Harmony.getScaleNotes("G#", Scale.Major)).to.have.ordered.members(["G#", "A#", "B#", "C#", "D#", "E#", "Fx"]);
        });

        it("can find scale notes for pentatonics (diatonic skips)", () => {
            expect(Harmony.getScaleNotes("F#", Scale.MajPentatonic)).to.have.ordered.members(["F#", "G#", "A#", "C#", "D#"]);
            expect(Harmony.getScaleNotes("E", Scale.MinPentatonic)).to.have.ordered.members(["E", "G", "A", "B", "D"]);
        });

        it("can find scale notes for Whole Tone", () => {
            expect(Harmony.getScaleNotes("C", Scale.WholeTone)).to.have.ordered.members(["C", "D", "E", "F#", "G#", "A#"]);
        });

        it("can find scale notes for Chromatic", () => {
            const expected = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            expect(Harmony.getScaleNotes("C", Scale.Chromatic)).to.have.ordered.members(expected);
        });

        it("can find scale notes for GS", () => {
            const expected = ["C", "Db", "Eb", "Fb", "Gbb", "Ab", "Bbb"];
            expect(Harmony.getScaleNotes("C", Scale.GS)).to.have.ordered.members(expected);
        });
    });
});
