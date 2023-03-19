import { expect } from "chai";
import { Key } from "../src/key";
import { Melody } from "../src/melody";
import { Scale } from "../src/mode";
import { Mutation } from "../src/mutation";
import * as helpers from "./test_helpers";


describe("Mutation", () => {
    const key    = new Key(60, Scale.Minor);
    const melody = new Melody(helpers.notesForScaleDegrees([1, 5, 6, 4], key), key);

    describe("tranformations that leave the original melody in-tact", () => {
        it("can transpose down by 2 scale degrees", () => {
            const mutatedMelody = Mutation.transposeDown2(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([-2, 3, 4, 2]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([56, 63, 65, 62]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
        });

        it("can reverse a melody", () => {
            const mutatedMelody = Mutation.reverse(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([4, 6, 5, 1]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([65, 68, 67, 60]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
        });

        it("can rotate a melody left by 3", () => {
            const mutatedMelody = Mutation.rotateLeftThree(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([4, 1, 5, 6]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([65, 60, 67, 68]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
        });

        it("can sort a melody", () => {
            const mutatedMelody = Mutation.sort(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 4, 5, 6]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([60, 65, 67, 68]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
        });

        it("can reverse sort a melody", () => {
            const mutatedMelody = Mutation.reverseSort(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([6, 5, 4, 1]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([68, 67, 65, 60]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
        });

        it("can invert a melody", () => {
            const mutatedMelody = Mutation.invert(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([8, 4, 3, 5]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([72, 65, 63, 67]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
        });

        it("can invert and reverse a melody", () => {
            const mutatedMelody = Mutation.invertReverse(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([5, 3, 4, 8]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([67, 63, 65, 72]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
        });

        it("can perform bit flipping mutations with 30% mutation", () => {
            const inputDegrees  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const melody        = new Melody(helpers.notesForScaleDegrees(inputDegrees, key), key);
            const mutatedMelody = Mutation.bitFlipMutation(melody);
            const outputDegrees = mutatedMelody.notes.map(n => n.scaleDegree);

            let matchingNotes = 0;
            for (let i = 0; i < inputDegrees.length; i++)
                if (inputDegrees[i] == outputDegrees[i])
                    matchingNotes++;

            expect(matchingNotes).to.eq(7);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
    });
});
