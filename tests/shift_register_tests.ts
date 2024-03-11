import { expect } from "chai";
import { ShiftRegister } from "../src/shift_register";


describe("ShiftRegister", () => {
    describe("when created", () => {
        const shiftRegister = new ShiftRegister();

        it("has a bit array of zeroes", () => expect(shiftRegister.bits).to.have.ordered.members([0, 0, 0, 0,  0, 0, 0, 0]));
        it("has a default decimal representation", () => expect(shiftRegister.decimal).to.eq(0));
        it("has a default length of 8", () => expect(shiftRegister.length).to.eq(8));
        it("has a default chance of 1", () => expect(shiftRegister.chance).to.eq(1));
    });


    describe("setting the state by bit array", () => {
        const shiftRegister = new ShiftRegister();
        shiftRegister.bits = [1, 1, 1, 1,  0, 0, 0, 0];

        it("updates the stored bit array", () => {
            expect(shiftRegister.bits).to.have.ordered.members([1, 1, 1, 1,  0, 0, 0, 0]);
        });

        it("updates the decimal", () => expect(shiftRegister.decimal).to.eq(15));
    });


    describe("setting the state by decimal", () => {
        const shiftRegister = new ShiftRegister();
        shiftRegister.decimal = 15;

        it("updates the decimal", () => expect(shiftRegister.decimal).to.eq(15));

        it("updates the stored bit array", () => {
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

        it("can be represented as an integer using binary to decimal conversion", () => expect(shiftRegister.decimal).to.eq(128));

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
            expect(shiftRegister.bits).to.have.ordered.members([1, 1, 0, 0,  0, 0, 0, 0]);
        });

        it("uses <length> digits in determing the decimal representation", () => {
            shiftRegister.bits = [1, 0, 1, 0,  1, 0, 1, 0];
            expect(shiftRegister.decimal).to.eq(5);
        });

        it("uses <length> digits when calculating the normalized decimal representation", () => {
            shiftRegister.bits = [1, 0, 1, 0,  1, 0, 1, 0];
            expect(shiftRegister.normalized()).to.eq(0.625);
        });
    });


    describe("when it acts like a step sequencer", () => {
        it("starts with a value of 0", () => {
            const shiftRegister = new ShiftRegister(3, 1);
            expect(shiftRegister.step()).to.eq(0);
        });

        it("produces a standard/deterministic shift register sequence with chance at 100%", () => {
            const shiftRegister = new ShiftRegister(3, 1);
            const sequence = new Array();
            for (let i = 0; i < 13; i++)
                sequence.push(shiftRegister.step());

            expect(sequence).to.have.ordered.members([0, 0.125, 0.375, 0.875, 0.75, 0.5, 0, 0.125, 0.375, 0.875, 0.75, 0.5, 0]);
        });

        it("produces a probabilistic shift register sequence with lower chance", () => {
            const shiftRegister = new ShiftRegister(3, 0.3);
            const sequence = new Array();
            for (let i = 0; i < 13; i++)
                sequence.push(shiftRegister.step());

            expect(sequence).not.to.have.ordered.members([0, 0.125, 0.375, 0.875, 0.75, 0.5, 0, 0.125, 0.375, 0.875, 0.75, 0.5, 0]);
        });

        it("updates its internal bit array with each step", () => {
            const shiftRegister = new ShiftRegister(3, 1);
            shiftRegister.step();
            expect(shiftRegister.bits).to.have.ordered.members([1, 0, 0, 0,  0, 0, 0, 0]);
            shiftRegister.step();
            expect(shiftRegister.bits).to.have.ordered.members([1, 1, 0, 0,  0, 0, 0, 0]);
            shiftRegister.step();
            expect(shiftRegister.bits).to.have.ordered.members([1, 1, 1, 0,  0, 0, 0, 0]);
            shiftRegister.step();
            expect(shiftRegister.bits).to.have.ordered.members([0, 1, 1, 0,  0, 0, 0, 0]);
            shiftRegister.step();
            expect(shiftRegister.bits).to.have.ordered.members([0, 0, 1, 0,  0, 0, 0, 0]);
            shiftRegister.step();
            expect(shiftRegister.bits).to.have.ordered.members([0, 0, 0, 0,  0, 0, 0, 0]);
        });
    });
});
