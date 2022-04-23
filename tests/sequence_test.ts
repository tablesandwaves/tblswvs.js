import { Sequence } from "../src/sequence";
import { expect } from "chai";

describe("Sequence", () => {
    it("has a default state", () => {
        const seq = new Sequence();

        expect(seq.steps).to.be.an("array");
        expect(seq.restSymbol).to.be.an("undefined");
        expect(seq.mode).to.equal("scale_degrees");
    })
})