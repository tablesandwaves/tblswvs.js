import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { MarkovChain } from "../src/markov_chain";


describe("MarkovChain", () => {
  describe("when constructing a MarkovChain from a Melody", () => {
    let markovChain: MarkovChain;
    beforeEach(() => {
      const melody = [1, 1, 4, 4, 5];
      markovChain = new MarkovChain(melody);
    });

    it("has its input melody", () => {
      assert.deepEqual(markovChain.input, [1, 1, 4, 4, 5]);
    });

    it("generates a state transition matrix", () => {
      const expected = new Map();
      expected.set("1:1", [1, 4]);
      expected.set("1:4", [4]);
      expected.set("4:4", [5]);
      for (let key of markovChain.stateTransitionMatrix.keys()) {
        assert.deepEqual(markovChain.stateTransitionMatrix.get(key), expected.get(key));
      }
    });

    it("responds to get requests", () => {
      assert.ok( [1, 4].includes( markovChain.get(1, 1) as number ) );
      assert.equal(markovChain.get(1, 4), 4);
      assert.equal(markovChain.get(4, 4), 5);
    });
  });
});
