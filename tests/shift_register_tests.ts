import { expect } from "chai";
import * as helpers from "./test_helpers";
import { ShiftRegister } from "../src/shift_register";


describe("ShiftRegister", () => {
    describe("when created", () => {
        const shiftRegister = new ShiftRegister();
        it("has a bit array of zeroes", () => expect(shiftRegister.bits).to.have.ordered.members([0, 0, 0, 0,  0, 0, 0, 0]));
        it("has a default length of 8", () => expect(shiftRegister.length).to.eq(8));
    });
});
