import { expect } from "chai";
import { Key } from "../src/key";
import { Melody } from "../src/melody";
import { Scale } from "../src/mode";
import { Mutation } from "../src/mutation";
import * as helpers from "./test_helpers";


describe("Mutation", () => {
    const key = new Key(60, Scale.Minor);

    it("can transpose down by 2 scale degrees", () => {
        const melody        = new Melody(helpers.notesForScaleDegrees([1, 5, 6, 4], key), key);
        const mutatedMelody = Mutation.transposeDown2(melody);
        expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([-2, 3, 4, 2]);
        expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([56, 63, 65, 62]);
    });

    it("can reverse a melody", () => {
        const melody        = new Melody(helpers.notesForScaleDegrees([1, 5, 6, 4], key), key);
        const mutatedMelody = Mutation.reverse(melody);
        expect(mutatedMelody.notes.map(n => n.scaleDegree)).to.have.ordered.members([4, 6, 5, 1]);
        expect(mutatedMelody.notes.map(n => n.midi)).to.have.ordered.members([65, 68, 67, 60]);
    });
});
