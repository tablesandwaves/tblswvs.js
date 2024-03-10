import { expect } from "chai";
import { ShiftRegister } from "../src/shift_register";


describe("ShiftRegister", () => {
    describe("when created", () => {
        const shiftRegister = new ShiftRegister();

        it("has a bit array of zeroes", () => expect(shiftRegister.bits).to.have.ordered.members([0, 0, 0, 0,  0, 0, 0, 0]));
        it("has a default length of 8", () => expect(shiftRegister.length).to.eq(8));
        it("can have its bit array set", () => {
            shiftRegister.bits = [1, 1, 1, 1,  0, 0, 0, 0];
            expect(shiftRegister.bits).to.have.ordered.members([1, 1, 1, 1,  0, 0, 0, 0]);
        });
    });


    describe("pushing new bits into it", () => {
        const shiftRegister = new ShiftRegister();
        shiftRegister.bits = [1, 0, 1, 0,  1, 0, 1, 0];
        shiftRegister.push(1);

        it("adds the new bit to the beginning", () => expect(shiftRegister.bits[0]).to.eq(1));

        it("rotates all bits to the right", () => {
            expect(shiftRegister.bits).to.have.ordered.members([1, 1, 0, 1,  0, 1, 0, 1]);
        });
    });
});
