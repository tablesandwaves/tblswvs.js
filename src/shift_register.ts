import { rotate, scaleToRange } from "./helpers";


const DEFAULT_BIT_ARRAY_SIZE = 8;


export class ShiftRegister {
    #bits:    (0|1)[];
    #decimal: number = 0;
    #length:  number;
    #chance:  number;


    constructor(length: number = DEFAULT_BIT_ARRAY_SIZE, chance: number = 1) {
        this.#length = length < 1 ? 1 : (length > DEFAULT_BIT_ARRAY_SIZE ? DEFAULT_BIT_ARRAY_SIZE : Math.floor(length));
        this.#chance = chance < 0 ? 0 : (chance > 1 ? 1 : chance);
        this.#bits   = new Array(DEFAULT_BIT_ARRAY_SIZE).fill(0);
    }


    get bits() {
        return this.#bits;
    }


    set bits(bits: (0|1)[]) {
        this.#bits = bits.slice(0, this.length).concat(new Array(DEFAULT_BIT_ARRAY_SIZE - this.bits.length).fill(0));
        this.#decimal = parseInt(this.bits.slice(0, this.length).reverse().join(""), 2);
    }


    get decimal() {
        return this.#decimal;
    }


    set decimal(decimal: number) {
        this.#decimal = decimal;
        this.#bits = this.decimal.toString(2).split("").reverse().map(bit => parseInt(bit) == 0 ? 0 : 1);
        this.#bits = this.#bits.concat(new Array(DEFAULT_BIT_ARRAY_SIZE - this.bits.length).fill(0));
    }


    get length() {
        return this.#length;
    }


    set length(length: number) {
        if (length < 1)
            this.#length = 1;
        else if (length > 8)
            this.#length = 8;
        else
            this.#length = Math.floor(length);
    }


    get chance() {
        return this.#chance;
    }


    set chance(chance: number) {
        if (chance < 0)
            this.#chance = 0;
        else if (chance > 1)
            this.#chance = 1;
        else
            this.#chance = chance;
    }


    push(bit: (0|1)) {
        const newBits = rotate(this.#bits.slice(0, this.length), 1);
        newBits[0] = bit;
        this.bits = newBits;
    }


    normalized() {
        return this.decimal / 2 ** this.length;
    }


    step(): number {
        const currentValue = this.decimal;
        const integerLimit = 2 ** this.length;

        const randomGate       = Math.random() < this.chance ? 1 : 0;
        const multipliedSteps  = this.decimal * 2;
        const overIntegerLimit = multipliedSteps >= integerLimit ? 1 : 0;
        const xorShift         = randomGate ^ overIntegerLimit;

        this.decimal = multipliedSteps % integerLimit + xorShift;

        return currentValue / integerLimit;
    }
}
