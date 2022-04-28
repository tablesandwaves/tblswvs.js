import { expect } from "chai";

import { LindenmayerSystem } from "../src/lindenmayer_system";


describe("LindenmayerSystem", () => {

    describe("the basic API", () => {
        let lsystem: LindenmayerSystem;
        beforeEach(() => {
            lsystem = new LindenmayerSystem("A");
            lsystem.add({matchStr: "A", output: "A B"});
        });
    
        it("can add rules using the productionRule type", () => {
            expect(lsystem.rules()).to.have.members(["A"]);
            expect(lsystem.productionRules).to.have.property("A", "A B");
        });
    
        it("begins with a string equal to the axiom", () => expect(lsystem.string).to.equal("A"));
    
        it("can change the axiom", () => {
            expect(lsystem.axiom).to.equal("A");
            lsystem.axiom = "B";
            expect(lsystem.axiom).to.equal("B");
        });
    
        it("can rewrite its string", () => {
            lsystem.add({matchStr: "A", output: "A B"});
            lsystem.add({matchStr: "B", output: "A"});
            lsystem.advance();
            expect(lsystem.string).to.equal("A B");
            lsystem.advance();
            expect(lsystem.string).to.equal("A B A");
            lsystem.advance();
            expect(lsystem.string).to.equal("A B A A B");
        });
    });


    describe("branching", () => {
        let lsystem = new LindenmayerSystem("F");
        lsystem.add({matchStr: "F", output: "F [ X ]"});
        lsystem.add({matchStr: "X", output: "F Y"});
        lsystem.advance();

        it("creates a new row in its matrix", () => {
            let matrix = lsystem.matrix();
            expect(matrix.length).to.equal(2)
        });

        it("starts the new row at the branch point", () => {
            let matrix = lsystem.matrix();
            expect(matrix[0][0]).to.equal("F");
            expect(matrix[0][0]).to.equal("F");
        });

        it("keeps adding rows as needed", () => {
            /**
             * String: F [ X ] [ F Y ]
             * Matrix:
             *    0  1
             * 0  F
             * 1  X
             * 2  F  Y
             */
            lsystem.advance();
            let matrix = lsystem.matrix();
            expect(matrix[0][0]).to.equal("F");
            expect(matrix[1][0]).to.equal("X");
            expect(matrix[2][0]).to.equal("F");
            expect(matrix[2][1]).to.equal("Y");

            /**
             * String: F [ X ] [ F Y ] [ F [ X ] Y ]
             * Matrix:
             *    0  1
             * 0  F
             * 1  X
             * 2  F  Y
             * 3  F  Y
             * 4  X
             */
            lsystem.advance();
            matrix = lsystem.matrix();
            expect(matrix[0][0]).to.equal("F")
            expect(matrix[1][0]).to.equal("X")
            expect(matrix[2][0]).to.equal("F")
            expect(matrix[2][1]).to.equal("Y")
            expect(matrix[3][0]).to.equal("F")
            expect(matrix[3][1]).to.equal("Y")
            expect(matrix[4][0]).to.equal("X")
        });
    });
});
