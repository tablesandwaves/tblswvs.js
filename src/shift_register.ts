import { rotate, scaleToRange } from "./helpers";


export class ShiftRegister {
    bits: (0|1)[];
    length: number;


    constructor(length: number = 8) {
        this.length = length;
        this.bits = new Array(length).fill(0);
    }


    push(bit: (0|1)) {
        this.bits = rotate(this.bits, 1);
        this.bits[0] = bit;
    }


    toDecimal() {
        return parseInt(this.bits.slice().reverse().join(""), 2);
    }


    normalized() {
        return scaleToRange(this.toDecimal(), [0, 256], [0, 1]);
    }
}
