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


    describe("its current value", () => {
        const shiftRegister = new ShiftRegister();
        shiftRegister.bits = [0, 0, 0, 0,  0, 0, 0, 1];

        it("can be represented as an integer using binary to decimal conversion", () => expect(shiftRegister.toDecimal()).to.eq(128));

        it("can be represented as a normalized decimal between 0.0 and 1.0", () => {
            const expected = Math.round((shiftRegister.normalized() + Number.EPSILON) * 1000) / 1000;
            expect(expected).to.eq(0.5);
        });
    });


    describe("shortening the length of the bit array", () => {
        const shiftRegister = new ShiftRegister(3);

        it("only rotates the bits up to that length when pushing a new bit into it", () => {
            shiftRegister.bits = [1, 0, 1, 0,  1, 0, 1, 0];
            shiftRegister.push(1);
            expect(shiftRegister.bits).to.have.ordered.members([1, 1, 0, 0,  1, 0, 1, 0]);
        });

        it("uses <length> digits in determing the decimal representation", () => {
            shiftRegister.bits = [1, 0, 1, 0,  1, 0, 1, 0];
            expect(shiftRegister.toDecimal()).to.eq(5);
        });

        it("uses <length> digits when calculating the normalized decimal representation", () => {
            shiftRegister.bits = [1, 0, 1, 0,  1, 0, 1, 0];
            expect(shiftRegister.normalized()).to.eq(0.625);
        });
    });
});
