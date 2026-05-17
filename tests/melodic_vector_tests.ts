import assert from "node:assert";
import { describe, it } from "node:test";
import { MelodicVector } from "../src/melodic_vector";
import { Melody } from "../src/melody";
import { Scale } from "../src/mode";
import { Key } from "../src/key";
import * as helpers from "./test_helpers";


describe("MelodicVector", () => {
  it("has properties", () => {
    const vector = new MelodicVector([1, 0]);
    it("should have steps that can be returned as values", () => assert.deepEqual(vector.steps, [1, 0]));
    it("should have numeric steps", () => vector.steps.forEach(step => assert.ok(typeof step == "number")));
  });


  describe("is a Transformation", () => {
    const key = new Key(60, Scale.Minor);

    it("can apply the shift in scale mode", () => {
      const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
        key, [1, 5, 6, 4], [1, 0], "scale"
      );
      assert.deepEqual(transformedMelodyScaleDegs, [2, 5, 7, 4]);
      assert.deepEqual(transformedMelodyMidiNotes, [62, 67, 70, 65]);
    });

    it("can apply the shift in MIDI mode which results in non-scale notes", () => {
      const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
        key, [1, 5, 6, 4], [1, 0], "midi"
      );
      assert.deepEqual(transformedMelodyScaleDegs, [undefined, 5, undefined, 4]);
      assert.deepEqual(transformedMelodyMidiNotes, [61, 67, 69, 65]);
    });

    it("can apply the shift in MIDI mode which results in new scale degrees notes", () => {
      const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
        key, [1, 5, 6, 4], [2, 0], "midi"
      );
      assert.deepEqual(transformedMelodyScaleDegs, [2, 5, 7, 4]);
      assert.deepEqual(transformedMelodyMidiNotes, [62, 67, 70, 65]);
    });

    it("can be applied to a sequence that is not a multiple of the transformation", () => {
      const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
        key, [1, 1, 5, 5, 7], [1, 0], "scale"
      );
      assert.deepEqual(transformedMelodyScaleDegs, [2, 1, 6, 5, 8]);
      assert.deepEqual(transformedMelodyMidiNotes, [62, 60, 68, 67, 72]);
    });

    it("can be applied to a sequence that is smaller than the transformation", () => {
      const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
        key, [1], [1, 0], "scale"
      );
      assert.deepEqual(transformedMelodyScaleDegs, [2]);
      assert.deepEqual(transformedMelodyMidiNotes, [62]);
    });

    it("will not shift a rest", () => {
      const notes = [
        { octave: 3, note: 'C', midi: 60, scaleDegree: 1 },
        { octave: -3, note: 'rest', midi: -1 },
        { octave: -3, note: 'rest', midi: -1 },
        { octave: -3, note: 'rest', midi: -1 }
      ]
      const melody = new Melody(notes, key);
      const vector = new MelodicVector([1, 0], "scale");
      const transformedMelody = vector.applyTo(melody).notes.map(n => n.midi);
      assert.deepEqual(transformedMelody, [62, -1, -1, -1]);
    });

    it("will leave the source melody unchanged", () => {
      const melody = new Melody(helpers.notesForScaleDegrees([1, 5, 6, 4], key), key);
      const vector = new MelodicVector([1, 0], "scale");
      const modified = vector.applyTo(melody);
      assert.deepEqual(modified.notes.map(n => n.scaleDegree), [2, 5, 7, 4]);
      assert.deepEqual(modified.notes.map(n => n.midi), [62, 67, 70, 65]);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
    });
  });


  describe("transformations for negative scale degrees", () => {
    const key = new Key(60, Scale.Minor);

    it("transposes correctly", () => {
      const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
        key, [1, 5, 6, 4], [-1, 0], "scale"
      );
      assert.deepEqual(transformedMelodyScaleDegs, [-1, 5, 5, 4]);
      assert.deepEqual(transformedMelodyMidiNotes, [58, 67, 67, 65]);
    })
  });
});
