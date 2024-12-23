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
            expect(mutatedMelody.key?.scale).to.eq(Scale.Minor);
            expect(mutatedMelody.key?.tonic).to.eq("C");
        });

        it("can reverse a melody", () => {
            const mutatedMelody = Mutation.reverse(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([4, 6, 5, 1]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([65, 68, 67, 60]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
            expect(mutatedMelody.key?.scale).to.eq(Scale.Minor);
            expect(mutatedMelody.key?.tonic).to.eq("C");
        });

        it("can rotate a melody left by 3", () => {
            const mutatedMelody = Mutation.rotateLeftThree(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([4, 1, 5, 6]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([65, 60, 67, 68]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
            expect(mutatedMelody.key?.scale).to.eq(Scale.Minor);
            expect(mutatedMelody.key?.tonic).to.eq("C");
        });

        it("can sort a melody", () => {
            const mutatedMelody = Mutation.sort(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 4, 5, 6]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([60, 65, 67, 68]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
            expect(mutatedMelody.key?.scale).to.eq(Scale.Minor);
            expect(mutatedMelody.key?.tonic).to.eq("C");
        });

        it("can reverse sort a melody", () => {
            const mutatedMelody = Mutation.reverseSort(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([6, 5, 4, 1]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([68, 67, 65, 60]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
            expect(mutatedMelody.key?.scale).to.eq(Scale.Minor);
            expect(mutatedMelody.key?.tonic).to.eq("C");
        });

        it("can invert a melody", () => {
            const mutatedMelody = Mutation.invert(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([8, 4, 3, 5]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([72, 65, 63, 67]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
            expect(mutatedMelody.key?.scale).to.eq(Scale.Minor);
            expect(mutatedMelody.key?.tonic).to.eq("C");
        });

        it("can invert and reverse a melody", () => {
            const mutatedMelody = Mutation.invertReverse(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([5, 3, 4, 8]);
            expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([67, 63, 65, 72]);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
            expect(mutatedMelody.key?.scale).to.eq(Scale.Minor);
            expect(mutatedMelody.key?.tonic).to.eq("C");
        });

        it("can perform bit flipping mutations with 30% mutation", () => {
            const inputDegrees  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const melody        = new Melody(helpers.notesForScaleDegrees(inputDegrees, key), key);
            const mutatedMelody = Mutation.bitFlip(melody);
            const outputDegrees = mutatedMelody.notes.map(n => n.scaleDegree);

            let matchingNotes = 0;
            for (let i = 0; i < inputDegrees.length; i++)
                if (inputDegrees[i] == outputDegrees[i])
                    matchingNotes++;

            expect(matchingNotes).to.eq(7);
            expect(melody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            expect(mutatedMelody.key?.scale).to.eq(Scale.Minor);
            expect(mutatedMelody.key?.tonic).to.eq("C");
        });

        it("can perform bit flipping mutations on negative scale degrees", () => {
            const inputDegrees  = [-1, -2, -3, -4];
            const melody        = new Melody(helpers.notesForScaleDegrees(inputDegrees, key), key);
            const mutatedMelody = Mutation.bitFlip(melody);
            mutatedMelody.notes.forEach(melodyNote => {
                expect(melodyNote.note).not.to.be.undefined;
                expect(melodyNote.scaleDegree).not.to.be.NaN;
                expect(melodyNote.midi).not.to.be.NaN;
            });
        });
    });


    describe("when randomly selecting mutations", () => {
        it("can choose a mutation from the list of available methods", () => {
            const mutatedMelody = Mutation.random(melody);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.be.an("array").that.does.not.eq([1, 5, 6, 4]);
        });

        it("can select a mutation from the list of method names passed", () => {
            const mutatedMelody = Mutation.random(melody, ["transposeDown2", "reverse", "rotateLeftThree"]);
            const expectedMutations = [
                [-2, 3, 4, 2],
                [4, 6, 5, 1],
                [4, 1, 5, 6]
            ]
            expect(expectedMutations).to.deep.include(mutatedMelody.notes.map(n => n.scaleDegree));
        });

        it("will return the original melody if no function name is matched", () => {
            const mutatedMelody = Mutation.random(melody, ["blerg", "blah"]);
            expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([1, 5, 6, 4]);
        });
    });
});
