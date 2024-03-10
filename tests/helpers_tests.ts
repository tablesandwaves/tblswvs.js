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

        /**
         * While not substantively different from the numeric array map above,
         * this is a reminder that when creating an interval map for negative
         * intervals to simply supply the array in this manner.
         */
        it("produces a lookup map for an array with negative numbers", () => {
            const map = util.inversionMap([-1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(map.get(-1)).to.equal(9);
            expect(map.get(9)).to.equal(-1);;
        });
    });


    describe("scaling numbers from one range to another", () => {
        it("can scale the boundaries", () => {
            expect(util.scaleToRange(0, [0, 255], [0, 1])).to.eq(0);
            expect(util.scaleToRange(255, [0, 255], [0, 1])).to.eq(1);
        });

        it("can scale the middle", () => {
            expect(util.scaleToRange(128, [0, 256], [0, 1])).to.eq(0.5);
            expect(util.scaleToRange(64,  [0, 256], [0, 1])).to.eq(0.25);
        });
    });
});
