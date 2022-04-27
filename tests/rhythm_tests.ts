import { expect } from "chai"; 

import { Melody, MelodyType } from "../src/melody";
import { Rhythm } from "../src/rhythm";
import * as helpers from "./test_helpers";


describe("Rhythm", () => {
    const rhythm = new Rhythm([1, 1, 0]);

    describe("is a Sequence", () => {
        it("should have steps that can be returned as values", () => expect(rhythm.values()).to.have.ordered.members([1, 1, 0]));
        it("should have step values of 1 or 0", () => rhythm.steps.forEach(step => expect(step).to.be.a("number").and.to.be.oneOf([0, 1])));
    });


    describe("is a Transformation", () => {
        const melody = new Melody([1, 1, 5, 5, 6, 6, 4, 4]);

        describe("when it's step hit length does not have a common denominator with the melody", () => {
            it("should wrap the melody when ending in a hit", () => {
                const rhythm   = new Rhythm([1, 1, 0, 0, 1]);
                const expected = [1, 1, 0, 0, 5, 5, 6, 0, 0, 6, 4, 4, 0, 0, 1];
                const actual   = rhythm.applyTo(melody).steps;
                expect(actual).to.have.ordered.members(expected);
            });

            it("should wrap the sequence when ending in a rest", () => {
                const rhythm = new Rhythm([1, 1, 0, 1, 0]);
                const expected = [1, 1, 0, 5, 0, 5, 6, 0, 6, 0, 4, 4, 0, 1, 0];
                const actual = rhythm.applyTo(melody).steps;
                expect(actual).to.have.ordered.members(expected);
            });
        });


        describe("when it's step hit length has a common denominator with the melody", () => {
            it("should wrap the rhythm when ending in a hit", () => {
                const rhythm = new Rhythm([1, 0, 1]);
                const expected = [1, 0, 1, 5, 0, 5, 6, 0, 6, 4, 0, 4];
                const actual = rhythm.applyTo(melody).steps;
                expect(actual).to.have.ordered.members(expected);
            });

            it("should wrap the rhythm when ending in a rest", () => {
                const rhythm = new Rhythm([1, 1, 0]);
                const expected = [1, 1, 0, 5, 5, 0, 6, 6, 0, 4, 4, 0];
                const actual = rhythm.applyTo(melody).steps;
                expect(actual).to.have.ordered.members(expected);
            });
        });


        describe("when it has a bar length", () => {
            it("repeats sequence to fill out the bar if set to wrap", () => {
                const rhythm = new Rhythm([1, 1, 0], "wrap", 16);
                const expected = [1, 1, 0, 5, 5, 0, 6, 6, 0, 4, 4, 0, 1, 1, 0, 5]
                const actual = rhythm.applyTo(melody).steps;
                expect(actual).to.have.ordered.members(expected);
            });

            it("will guarantee a step length regardless of the sequence's step size by adding rests", () => {
                const rhythm = new Rhythm([1], "silence", 16);
                const expected = [1, 1, 5, 5, 6, 6, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0];
                const actual = rhythm.applyTo(melody).steps;
                expect(actual).to.have.ordered.members(expected);
            });
        });
    });
});
