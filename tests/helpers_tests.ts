import { expect } from "chai";

import * as util from "../src/helpers";


describe("tblswvs.util", () => {
    describe("rotation", () => {
        it("can rotate right with a positive number", () => {
            expect(util.rotate([1, 2, 3, 4, 5], 2)).to.have.ordered.members([4, 5, 1, 2, 3]);
        });

        it("can rotate left with a negative number", () => {
            expect(util.rotate([1, 2, 3, 4, 5], -2)).to.have.ordered.members([3, 4, 5, 1, 2]);
        });
    });


    describe("interval maps", () => {
        it("produces a lookup map for an even number of intervals", () => {
            const map = util.inversionMap(8);
            expect(map.get(1)).to.equal(8);
            expect(map.get(2)).to.equal(7);
            expect(map.get(3)).to.equal(6);
            expect(map.get(4)).to.equal(5);
            expect(map.get(5)).to.equal(4);
            expect(map.get(6)).to.equal(3);
            expect(map.get(7)).to.equal(2);
            expect(map.get(8)).to.equal(1);
        });

        it("produces a lookup map for an odd number of intervals", () => {
            const map = util.inversionMap(5);
            expect(map.get(1)).to.equal(5);
            expect(map.get(2)).to.equal(4);
            expect(map.get(3)).to.equal(3);
            expect(map.get(4)).to.equal(2);
            expect(map.get(5)).to.equal(1);
        });

        it("produces a lookup map for a numeric array", () => {
            const map = util.inversionMap([60, 63, 63, 72, 67]);
            expect(map.get(60)).to.equal(72);
            expect(map.get(63)).to.equal(67);
            expect(map.get(67)).to.equal(63);
            expect(map.get(72)).to.equal(60);
        });
    });
});