import assert from "node:assert";
import { describe, it } from "node:test";
import { Key } from "../src/key";
import { Melody } from "../src/melody";
import { Scale } from "../src/mode";
import { Mutation } from "../src/mutation";
import * as helpers from "./test_helpers";


describe("Mutation", () => {
  const key  = new Key(60, Scale.Minor);
  const melody = new Melody(helpers.notesForScaleDegrees([1, 5, 6, 4], key), key);

  describe("tranformations that leave the original melody in-tact", () => {
    it("can transpose down by 2 scale degrees", () => {
      const mutatedMelody = Mutation.transposeDown2(melody);
      assert.deepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [-2, 3, 4, 2]);
      assert.deepEqual(mutatedMelody.notes.map(n => n.midi), [56, 63, 65, 62]);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
      assert.equal(mutatedMelody.key?.scale, Scale.Minor);
      assert.equal(mutatedMelody.key?.tonic, "C");
    });

    it("can reverse a melody", () => {
      const mutatedMelody = Mutation.reverse(melody);
      assert.deepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [4, 6, 5, 1]);
      assert.deepEqual(mutatedMelody.notes.map(n => n.midi), [65, 68, 67, 60]);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
      assert.deepEqual(mutatedMelody.key?.scale, Scale.Minor);
      assert.deepEqual(mutatedMelody.key?.tonic, "C");
    });

    it("can rotate a melody left by 3", () => {
      const mutatedMelody = Mutation.rotateLeftThree(melody);
      assert.deepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [4, 1, 5, 6]);
      assert.deepEqual(mutatedMelody.notes.map(n => n.midi), [65, 60, 67, 68]);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
      assert.deepEqual(mutatedMelody.key?.scale, Scale.Minor);
      assert.deepEqual(mutatedMelody.key?.tonic, "C");
    });

    it("can sort a melody", () => {
      const mutatedMelody = Mutation.sort(melody);
      assert.deepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [1, 4, 5, 6]);
      assert.deepEqual(mutatedMelody.notes.map(n => n.midi), [60, 65, 67, 68]);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
      assert.deepEqual(mutatedMelody.key?.scale, Scale.Minor);
      assert.deepEqual(mutatedMelody.key?.tonic, "C");
    });

    it("can reverse sort a melody", () => {
      const mutatedMelody = Mutation.reverseSort(melody);
      assert.deepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [6, 5, 4, 1]);
      assert.deepEqual(mutatedMelody.notes.map(n => n.midi), [68, 67, 65, 60]);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
      assert.deepEqual(mutatedMelody.key?.scale, Scale.Minor);
      assert.deepEqual(mutatedMelody.key?.tonic, "C");
    });

    it("can invert a melody", () => {
      const mutatedMelody = Mutation.invert(melody);
      assert.deepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [8, 4, 3, 5]);
      assert.deepEqual(mutatedMelody.notes.map(n => n.midi), [72, 65, 63, 67]);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
      assert.deepEqual(mutatedMelody.key?.scale, Scale.Minor);
      assert.deepEqual(mutatedMelody.key?.tonic, "C");
    });

    it("can invert and reverse a melody", () => {
      const mutatedMelody = Mutation.invertReverse(melody);
      assert.deepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [5, 3, 4, 8]);
      assert.deepEqual(mutatedMelody.notes.map(n => n.midi), [67, 63, 65, 72]);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
      assert.deepEqual(mutatedMelody.key?.scale, Scale.Minor);
      assert.deepEqual(mutatedMelody.key?.tonic, "C");
    });

    it("can perform bit flipping mutations with 30% mutation", () => {
      const inputDegrees  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const melody    = new Melody(helpers.notesForScaleDegrees(inputDegrees, key), key);
      const mutatedMelody = Mutation.bitFlip(melody);
      const outputDegrees = mutatedMelody.notes.map(n => n.scaleDegree);

      let matchingNotes = 0;
      for (let i = 0; i < inputDegrees.length; i++)
        if (inputDegrees[i] == outputDegrees[i])
          matchingNotes++;

      assert.deepEqual(matchingNotes, 7);
      assert.deepEqual(melody.notes.map(n => n.scaleDegree), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      assert.deepEqual(mutatedMelody.key?.scale, Scale.Minor);
      assert.deepEqual(mutatedMelody.key?.tonic, "C");
    });

    // it("can perform bit flipping mutations on negative scale degrees", () => {
    //   const inputDegrees  = [-1, -2, -3, -4];
    //   const melody    = new Melody(helpers.notesForScaleDegrees(inputDegrees, key), key);
    //   const mutatedMelody = Mutation.bitFlip(melody);
    //   mutatedMelody.notes.forEach(melodyNote => {
    //     assert.deepEqual(melodyNote.note).not.to.be.undefined;
    //     assert.deepEqual(melodyNote.scaleDegree).not.to.be.NaN;
    //     assert.deepEqual(melodyNote.midi).not.to.be.NaN;
    //   });
    // });
  });


  describe("when randomly selecting mutations", () => {
    it("can choose a mutation from the list of available methods", () => {
      const mutatedMelody = Mutation.random(melody);
      assert.notDeepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
    });

    it("can select a mutation from the list of method names passed", () => {
      const expectedMutations = [
        [-2, 3, 4, 2],
        [4, 6, 5, 1],
        [4, 1, 5, 6]
      ];
      const actualMutation = Mutation.random(melody, ["transposeDown2", "reverse", "rotateLeftThree"]).notes.map(n => n.scaleDegree);

      let match = false;
      for (let i = 0; i < expectedMutations.length; i++)
        if (expectedMutations[i].join(" ") === actualMutation.join(" "))
          match = true;

      assert.ok(match);
    });

    it("will return the original melody if no function name is matched", () => {
      const mutatedMelody = Mutation.random(melody, ["blerg", "blah"]);
      assert.deepEqual(mutatedMelody.notes.map(n => n.scaleDegree), [1, 5, 6, 4]);
    });
  });
});
