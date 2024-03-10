export class ShiftRegister {
    bits: (0|1)[];
    length: number;


    constructor(length: number = 8) {
        this.length = length;
        this.bits = new Array(length).fill(0);
    }
}
