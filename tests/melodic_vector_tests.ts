import { expect } from "chai";

import { MelodicVector } from "../src/melodic_vector";
import { Melody, MelodyType } from "../src/melody";
import * as helpers from "./test_helpers";


describe("MelodicVector", () => {
    const vector = new MelodicVector([1, 0]);

    describe("is a Sequence", () => {
        it("should have steps that can be returned as values", () => expect(vector.values()).to.have.ordered.members([1, 0]));
        it("should have numeric steps", () => vector.steps.forEach(step => expect(step).to.be.a("number")));
    });


    describe("is a Transformation", () => {
        it("should apply to the melody using addition", () => {
            const melody = new Melody([1, 5, 6, 4]);
            const transformedMelody = vector.applyTo(melody).steps;
            expect(transformedMelody).to.have.ordered.members([2, 5, 7, 4]);
        });

        it("can be applied to a sequence that is not a multiple of the transformation", () => {
            const melody = new Melody([1, 1, 5, 5, 7]);
            const transformedMelody = vector.applyTo(melody).steps;
            expect(transformedMelody).to.have.ordered.members([2, 1, 6, 5, 8]);
        });

        it("can be applied to a sequence that is smaller than the transformation", () => {
            const melody = new Melody([1]);
            const transformedMelody = vector.applyTo(melody).steps;
            expect(transformedMelody).to.have.ordered.members([2]);
        });

        it("will not shift a rest when using scale degrees", () => {
            const melody = new Melody([1, 0, 0, 0]);
            const transformedMelody = vector.applyTo(melody).steps;
            expect(transformedMelody).to.have.ordered.members([2, 0, 0, 0]);
        });

        it("will shift a rest when using MIDI notes", () => {
            const melody = new Melody([0, 7, 9, 5], "-", MelodyType.MIDI );
            const transformedMelody = vector.applyTo(melody).steps;
            expect(transformedMelody).to.have.ordered.members([1, 7, 10, 5]);
        });

        it("can be applied to a melody that uses a string as a rest sybmol", () => {
            const melody = new Melody([0, 7, "-", 5], "-", MelodyType.MIDI);
            const transformedMelody = vector.applyTo(melody).steps;
            expect(transformedMelody).to.have.ordered.members([1, 7, "-", 5]);
        });
    });
});