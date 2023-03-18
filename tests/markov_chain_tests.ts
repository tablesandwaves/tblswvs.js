import { expect } from "chai";

import { MarkovChain } from "../src/markov_chain";


describe("MarkovChain", () => {
    describe("when constructing a MarkovChain from a Melody", () => {
        let markovChain: MarkovChain;
        beforeEach(() => {
            const melody = [1, 1, 4, 4, 5];
            markovChain = new MarkovChain(melody);
        });

        it("has its input melody", () => {
            expect(markovChain.input).to.be.an("array").that.has.ordered.members([1, 1, 4, 4, 5]);
        });

        it("generates a state transition matrix", () => {
            const expected = new Map();
            expected.set("1:1", [1, 4]);
            expected.set("1:4", [4]);
            expected.set("4:4", [5]);
            for (let key of markovChain.stateTransitionMatrix.keys()) {
                expect(markovChain.stateTransitionMatrix.get(key)).to.be.an("array").that.has.members(expected.get(key));
            }
        });

        it("responds to get requests", () => {
            expect([1, 4]).to.include(markovChain.get(1, 1));
            expect(markovChain.get(1, 4)).to.be.a("number").that.equals(4);
            expect(markovChain.get(4, 4)).to.be.a("number").that.equals(5);
        })
    });
});
