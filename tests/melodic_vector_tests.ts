import { expect } from "chai";

import { Sequence } from "../src/sequence";
import { MelodicVector } from "../src/melodic_vector";
import { Melody } from "../src/melody";
import * as helpers from "./test_helpers";


describe("MelodicVector", () => {
    const vector = new MelodicVector([1, 0]);

    describe("conforms to the Sequence interface", () => {
        it("should have steps that can be returned as values", () => expect(vector.values()).to.have.ordered.members([1, 0]));
        it("should have numeric steps", () => vector.steps.forEach(step => expect(step).to.be.a("number")));
    });


    describe("conforms to the Transformation interface", () => {
        it("should apply to the melody using addition", () => {
            const melody = new Melody( helpers.getMelodicSteps([1, 5, 6, 4] ));
            const transformedMelody = vector.applyTo(melody).steps.map(step => step.value);
            expect(transformedMelody).to.have.ordered.members([2, 5, 7, 4]);
        });

        it("can be applied to a sequence that is not a multiple of the transformation", () => {
            const melody = new Melody( helpers.getMelodicSteps([1, 1, 5, 5, 7]) );
            const transformedMelody = vector.applyTo(melody).steps.map(step => step.value);
            expect(transformedMelody).to.have.ordered.members([2, 1, 6, 5, 8]);
        });
    });
});