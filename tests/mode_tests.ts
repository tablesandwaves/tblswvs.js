import { expect } from "chai";

import { Mode, Scale } from "../src/mode";


describe("Mode", () => {
    describe("has properties", () => {
        const aeolian = new Mode(Scale.Aeolian);

        it("knows its scale", () => expect(aeolian.scale).to.equal(Scale.Aeolian));
        it("has a name", () => expect(aeolian.name).to.equal("Aeolian"));
    });


    describe("the base western scales can be derived", () => {
        it("Major/Ionian", () => {
            const expectedStepOffsets = [2, 2, 1, 2, 2, 2, 1];
            const expectedScaleOffsets = [0, 2, 4, 5, 7, 9, 11];
            const expectedQualities = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];

            const major = new Mode(Scale.Major);
            expect(major.stepOffsets).to.have.ordered.members(expectedStepOffsets);
            expect(major.scaleOffsets).to.have.ordered.members(expectedScaleOffsets);
            expect(major.chordQualities).to.have.ordered.members(expectedQualities);

            const ionian = new Mode(Scale.Ionian);
            expect(ionian.stepOffsets).to.have.ordered.members(expectedStepOffsets);
            expect(ionian.scaleOffsets).to.have.ordered.members(expectedScaleOffsets);
            expect(ionian.chordQualities).to.have.ordered.members(expectedQualities);
        });

        it("Minor/Aeolian", () => {
            const expectedStepOffsets = [2, 1, 2, 2, 1, 2, 2];
            const expectedScaleOffsets = [0, 2, 3, 5, 7, 8, 10];
            const expectedQualities = ["m", "dim", "M", "m", "m", "M", "M"];

            const minor = new Mode(Scale.Minor);
            expect(minor.stepOffsets).to.have.ordered.members(expectedStepOffsets);
            expect(minor.scaleOffsets).to.have.ordered.members(expectedScaleOffsets);
            expect(minor.chordQualities).to.have.ordered.members(expectedQualities);

            const aeolian = new Mode(Scale.Aeolian);
            expect(aeolian.stepOffsets).to.have.ordered.members(expectedStepOffsets);
            expect(aeolian.scaleOffsets).to.have.ordered.members(expectedScaleOffsets);
            expect(aeolian.chordQualities).to.have.ordered.members(expectedQualities);
        });

        it("Dorian", () => {
            const dorianMode = new Mode(Scale.Dorian);
            expect(dorianMode.scaleOffsets).to.have.ordered.members([0, 2, 3, 5, 7, 9, 10]);
            expect(dorianMode.chordQualities).to.have.ordered.members(['m', 'm', 'M', 'M', 'm', 'dim', 'M']);
        });

        it("Phrygian", () => {
            const phrygianMode = new Mode(Scale.Phrygian);
            expect(phrygianMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 5, 7, 8, 10]);
            expect(phrygianMode.chordQualities).to.have.ordered.members(["m", "M", "M", "m", "dim", "M", "m"]);
        });

        it("Lydian", () => {
            const lydianMode = new Mode(Scale.Lydian);
            expect(lydianMode.scaleOffsets).to.have.ordered.members([0, 2, 4, 6, 7, 9, 11]);
            expect(lydianMode.chordQualities).to.have.ordered.members(["M", "M", "m", "dim", "M", "m", "m"]);
        });

        it("Mixolydian", () => {
            const mixolydianMode = new Mode(Scale.Mixolydian);
            expect(mixolydianMode.scaleOffsets).to.have.ordered.members([0, 2, 4, 5, 7, 9, 10]);
            expect(mixolydianMode.chordQualities).to.have.ordered.members(["M", "m", "dim", "M", "m", "m", "M"]);
        });

        it("Locrian", () => {
            const locrianMode = new Mode(Scale.Locrian);
            expect(locrianMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 5, 6, 8, 10]);
            expect(locrianMode.chordQualities).to.have.ordered.members(["dim", "M", "m", "m", "M", "M", "m"]);
        });
    });


    describe("the non-heptatonic and custom scales can be computed", () => {
        it("Pentatonic Major", () => {
            const pentMaj = new Mode(Scale.MajPentatonic);
            expect(pentMaj.scaleOffsets).to.have.ordered.members([0, 2, 4, 7, 9]);
            expect(pentMaj.chordQualities).to.have.ordered.members(["m/3", "sus2/2", "sus2/2", "M/5", "sus2/2"]);
        });

        it("Pentatonic Minor", () => {
            const pentMin = new Mode(Scale.MinPentatonic);
            expect(pentMin.scaleOffsets).to.have.ordered.members([0, 3, 5, 7, 10]);
            expect(pentMin.chordQualities).to.have.ordered.members(["sus2/2", "m/3", "sus2/2", "sus2/2", "M/5"]);
        });

        it("Whole Tone", () => {
            const wholeTone = new Mode(Scale.WholeTone);
            expect(wholeTone.scaleOffsets).to.have.ordered.members([0, 2, 4, 6, 8, 10]);
            expect(wholeTone.chordQualities).to.have.ordered.members(["aug", "aug", "aug", "aug", "aug", "aug"]);
        });

        it("Diminished", () => {
            const diminished = new Mode(Scale.Diminished);
            expect(diminished.scaleOffsets).to.have.ordered.members([0, 2, 3, 5, 6, 8, 9, 11]);
            expect(diminished.chordQualities).to.have.ordered.members(["dim", "dim", "dim", "dim", "dim", "dim", "dim", "dim"]);
        });

        it("Chromatic", () => {
            const chromatic = new Mode(Scale.Chromatic);
            const expectedScaleOffsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const expectedQualities = ["WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT"];
            expect(chromatic.scaleOffsets).to.have.ordered.members(expectedScaleOffsets);
            expect(chromatic.chordQualities).to.have.ordered.members(expectedQualities);
        });

        it("GS", () => {
            const gsMode = new Mode(Scale.GS);
            expect(gsMode.scaleOffsets).to.have.ordered.members([0, 1, 3, 4, 5, 8, 9]);
            expect(gsMode.chordQualities).to.have.ordered.members(["m5bb", "m", "sus25b", "aug", "aug", "M", "M"]);
        });
    });
});
