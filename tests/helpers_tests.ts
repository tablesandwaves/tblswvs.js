// import { assert.equal } from "chai";
import assert from "node:assert";
import { before, describe, it } from "node:test";


import * as util from "../src/helpers";


describe("tblswvs.util", () => {
  describe("rotation", () => {
    it("can rotate right with a positive number", () => {
      assert.deepEqual(util.rotate([1, 2, 3, 4, 5], 2), [4, 5, 1, 2, 3]);
    });

    it("can rotate left with a negative number", () => {
      assert.deepEqual(util.rotate([1, 2, 3, 4, 5], -2), [3, 4, 5, 1, 2]);
    });
  });


  describe("interval maps", () => {
    it("produces a lookup map for an even number of intervals", () => {
      const map = util.inversionMap(8);
      assert.equal(map.get(1), 8);
      assert.equal(map.get(2), 7);
      assert.equal(map.get(3), 6);
      assert.equal(map.get(4), 5);
      assert.equal(map.get(5), 4);
      assert.equal(map.get(6), 3);
      assert.equal(map.get(7), 2);
      assert.equal(map.get(8), 1);
    });

    it("produces a lookup map for an odd number of intervals", () => {
      const map = util.inversionMap(5);
      assert.equal(map.get(1), 5);
      assert.equal(map.get(2), 4);
      assert.equal(map.get(3), 3);
      assert.equal(map.get(4), 2);
      assert.equal(map.get(5), 1);
    });

    it("produces a lookup map for a numeric array", () => {
      const map = util.inversionMap([60, 63, 63, 72, 67]);
      assert.equal(map.get(60), 72);
      assert.equal(map.get(63), 67);
      assert.equal(map.get(67), 63);
      assert.equal(map.get(72), 60);
    });

    /**
     * While not substantively different from the numeric array map above,
     * this is a reminder that when creating an interval map for negative
     * intervals to simply supply the array in this manner.
     */
    it("produces a lookup map for an array with negative numbers", () => {
      const map = util.inversionMap([-1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      assert.equal(map.get(-1), 9);
      assert.equal(map.get(9), -1);;
    });
  });


  describe("scaling numbers from one range to another", () => {
    it("can scale the boundaries", () => {
      assert.equal(util.scaleToRange(0, [0, 255], [0, 1]), 0);
      assert.equal(util.scaleToRange(255, [0, 255], [0, 1]), 1);
    });

    it("can scale the middle", () => {
      assert.equal(util.scaleToRange(128, [0, 256], [0, 1]), 0.5);
      assert.equal(util.scaleToRange(64,  [0, 256], [0, 1]), 0.25);
    });
  });
});
