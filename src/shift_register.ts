import { rotate, scaleToRange } from "./helpers";


export class ShiftRegister {
    bits: (0|1)[];
    length: number;


    constructor(length: number = 8) {
        this.length = length;
        this.bits = new Array(8).fill(0);
    }


    push(bit: (0|1)) {
        this.bits.splice(0, this.length, ...rotate(this.bits.slice(0, this.length), 1));
        this.bits[0] = bit;
    }


    toDecimal() {
        return parseInt(this.bits.slice(0, this.length).reverse().join(""), 2);
    }


    normalized() {
        return scaleToRange(this.toDecimal(), [0, 2 ** this.length], [0, 1]);
    }
}
