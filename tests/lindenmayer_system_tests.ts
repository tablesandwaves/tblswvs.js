import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";


import { LindenmayerSystem } from "../src/lindenmayer_system";


describe("LindenmayerSystem", () => {

  describe("the basic API", () => {
    let lsystem: LindenmayerSystem;
    beforeEach(() => {
      lsystem = new LindenmayerSystem("A");
      lsystem.add({matchStr: "A", output: "A B"});
    });

    it("can add rules using the productionRule type", () => {
      assert.deepEqual(lsystem.rules(), ["A"]);
      assert.deepEqual(lsystem.productionRules, { A: 'A B' });
    });

    it("begins with a string equal to the axiom", () => assert.equal(lsystem.string, "A"));

    it("can change the axiom", () => {
      assert.equal(lsystem.axiom, "A");
      lsystem.axiom = "B";
      assert.equal(lsystem.axiom, "B");
    });

    it("can rewrite its string", () => {
      lsystem.add({matchStr: "A", output: "A B"});
      lsystem.add({matchStr: "B", output: "A"});
      lsystem.advance();
      assert.equal(lsystem.string, "A B");
      lsystem.advance();
      assert.equal(lsystem.string, "A B A");
      lsystem.advance();
      assert.equal(lsystem.string, "A B A A B");
    });
  });


  describe("branching", () => {
    let lsystem = new LindenmayerSystem("F");
    lsystem.add({matchStr: "F", output: "F [ X ]"});
    lsystem.add({matchStr: "X", output: "F Y"});
    lsystem.advance();

    it("creates a new row in its matrix", () => {
      let matrix = lsystem.matrix();
      assert.equal(matrix.length, 2)
    });

    it("starts the new row at the branch point", () => {
      let matrix = lsystem.matrix();
      assert.equal(matrix[0][0], "F");
      assert.equal(matrix[0][0], "F");
    });

    it("keeps adding rows as needed", () => {
      /**
       * String: F [ X ] [ F Y ]
       * Matrix:
       *  0  1
       * 0  F
       * 1  X
       * 2  F  Y
       */
      lsystem.advance();
      let matrix = lsystem.matrix();
      assert.equal(matrix[0][0], "F");
      assert.equal(matrix[1][0], "X");
      assert.equal(matrix[2][0], "F");
      assert.equal(matrix[2][1], "Y");

      /**
       * String: F [ X ] [ F Y ] [ F [ X ] Y ]
       * Matrix:
       *  0  1
       * 0  F
       * 1  X
       * 2  F  Y
       * 3  F  Y
       * 4  X
       */
      lsystem.advance();
      matrix = lsystem.matrix();
      assert.equal(matrix[0][0], "F")
      assert.equal(matrix[1][0], "X")
      assert.equal(matrix[2][0], "F")
      assert.equal(matrix[2][1], "Y")
      assert.equal(matrix[3][0], "F")
      assert.equal(matrix[3][1], "Y")
      assert.equal(matrix[4][0], "X")
    });
  });
});
