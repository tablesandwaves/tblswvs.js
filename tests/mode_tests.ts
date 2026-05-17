import assert from "node:assert";
import { describe, it } from "node:test";
import { Mode, Scale } from "../src/mode";


describe("Mode", () => {
  describe("has properties", () => {
    const aeolian = new Mode(Scale.Aeolian);

    it("knows its scale", () => assert.equal(aeolian.scale, Scale.Aeolian));
    it("has a name", () => assert.equal(aeolian.name, "Aeolian"));
  });


  describe("the base western scales can be derived", () => {
    it("Major/Ionian", () => {
      const expectedStepOffsets = [2, 2, 1, 2, 2, 2, 1];
      const expectedScaleOffsets = [0, 2, 4, 5, 7, 9, 11];
      const expectedQualities = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];

      const major = new Mode(Scale.Major);
      assert.deepEqual(major.stepOffsets, expectedStepOffsets);
      assert.deepEqual(major.scaleOffsets, expectedScaleOffsets);
      assert.deepEqual(major.chordQualities, expectedQualities);

      const ionian = new Mode(Scale.Ionian);
      assert.deepEqual(ionian.stepOffsets, expectedStepOffsets);
      assert.deepEqual(ionian.scaleOffsets, expectedScaleOffsets);
      assert.deepEqual(ionian.chordQualities, expectedQualities);
    });

    it("Minor/Aeolian", () => {
      const expectedStepOffsets = [2, 1, 2, 2, 1, 2, 2];
      const expectedScaleOffsets = [0, 2, 3, 5, 7, 8, 10];
      const expectedQualities = ["m", "dim", "M", "m", "m", "M", "M"];

      const minor = new Mode(Scale.Minor);
      assert.deepEqual(minor.stepOffsets, expectedStepOffsets);
      assert.deepEqual(minor.scaleOffsets, expectedScaleOffsets);
      assert.deepEqual(minor.chordQualities, expectedQualities);

      const aeolian = new Mode(Scale.Aeolian);
      assert.deepEqual(aeolian.stepOffsets, expectedStepOffsets);
      assert.deepEqual(aeolian.scaleOffsets, expectedScaleOffsets);
      assert.deepEqual(aeolian.chordQualities, expectedQualities);
    });

    it("Dorian", () => {
      const dorianMode = new Mode(Scale.Dorian);
      assert.deepEqual(dorianMode.scaleOffsets, [0, 2, 3, 5, 7, 9, 10]);
      assert.deepEqual(dorianMode.chordQualities, ['m', 'm', 'M', 'M', 'm', 'dim', 'M']);
    });

    it("Phrygian", () => {
      const phrygianMode = new Mode(Scale.Phrygian);
      assert.deepEqual(phrygianMode.scaleOffsets, [0, 1, 3, 5, 7, 8, 10]);
      assert.deepEqual(phrygianMode.chordQualities, ["m", "M", "M", "m", "dim", "M", "m"]);
    });

    it("Lydian", () => {
      const lydianMode = new Mode(Scale.Lydian);
      assert.deepEqual(lydianMode.scaleOffsets, [0, 2, 4, 6, 7, 9, 11]);
      assert.deepEqual(lydianMode.chordQualities, ["M", "M", "m", "dim", "M", "m", "m"]);
    });

    it("Mixolydian", () => {
      const mixolydianMode = new Mode(Scale.Mixolydian);
      assert.deepEqual(mixolydianMode.scaleOffsets, [0, 2, 4, 5, 7, 9, 10]);
      assert.deepEqual(mixolydianMode.chordQualities, ["M", "m", "dim", "M", "m", "m", "M"]);
    });

    it("Locrian", () => {
      const locrianMode = new Mode(Scale.Locrian);
      assert.deepEqual(locrianMode.scaleOffsets, [0, 1, 3, 5, 6, 8, 10]);
      assert.deepEqual(locrianMode.chordQualities, ["dim", "M", "m", "m", "M", "M", "m"]);
    });
  });


  describe("the non-heptatonic and custom scales can be computed", () => {
    it("Pentatonic Major", () => {
      const pentMaj = new Mode(Scale.MajPentatonic);
      assert.deepEqual(pentMaj.scaleOffsets, [0, 2, 4, 7, 9]);
      assert.deepEqual(pentMaj.chordQualities, ["m/3", "sus2/2", "sus2/2", "M/5", "sus2/2"]);
    });

    it("Pentatonic Minor", () => {
      const pentMin = new Mode(Scale.MinPentatonic);
      assert.deepEqual(pentMin.scaleOffsets, [0, 3, 5, 7, 10]);
      assert.deepEqual(pentMin.chordQualities, ["sus2/2", "m/3", "sus2/2", "sus2/2", "M/5"]);
    });

    it("Whole Tone", () => {
      const wholeTone = new Mode(Scale.WholeTone);
      assert.deepEqual(wholeTone.scaleOffsets, [0, 2, 4, 6, 8, 10]);
      assert.deepEqual(wholeTone.chordQualities, ["aug", "aug", "aug", "aug", "aug", "aug"]);
    });

    it("Diminished", () => {
      const diminished = new Mode(Scale.Diminished);
      assert.deepEqual(diminished.scaleOffsets, [0, 2, 3, 5, 6, 8, 9, 11]);
      assert.deepEqual(diminished.chordQualities, ["dim", "dim", "dim", "dim", "dim", "dim", "dim", "dim"]);
    });

    it("Chromatic", () => {
      const chromatic = new Mode(Scale.Chromatic);
      const expectedScaleOffsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const expectedQualities = ["WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT", "WT"];
      assert.deepEqual(chromatic.scaleOffsets, expectedScaleOffsets);
      assert.deepEqual(chromatic.chordQualities, expectedQualities);
    });

    it("GS", () => {
      const gsMode = new Mode(Scale.GS);
      assert.deepEqual(gsMode.scaleOffsets, [0, 1, 3, 4, 5, 8, 9]);
      assert.deepEqual(gsMode.chordQualities, ["m5bb", "m", "sus25b", "aug", "aug", "M", "M"]);
    });
  });
});
