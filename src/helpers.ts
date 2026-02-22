import { TblswvsError } from "./tblswvs_error";


export const NON_INTEGER_INPUTS = "Numbers must be integers";

export const SELF_SIMILARITY_REQUIRES_COPRIMES =
    "A self-similar melody can only be produced for an input sequence length " +
    "that is coprime with the output sequence length";

export const SCALE_DEGREE_ERROR =
    "Scale degrees must be negative or positive, but not 0";

export const SCALE_DEGREE_SHIFTS_REQUIRE_KEY =
    "Melodic vectors with shift mode 'scale' can only operate on a Melody with a Key";

export const KEY_REQUIRED_FOR_MUTATION =
    "Mutations require a Melody object with a key";

export const RANGE_ERROR =
    "Range must contain two numbers with min (index 0) smaller than max (index 1)";


export const unique = (value: any, index: number, self: any) => {
    return self.indexOf(value) === index;
}


export const areCoprime = (num1: number, num2: number) => {
    if (!Number.isInteger(num1) || !Number.isInteger(num2))
        throw new TblswvsError(NON_INTEGER_INPUTS);

    const smaller = num1 > num2 ? num2 : num1;
    for (let i = 2; i <= smaller; i++)
        if ((num1 % i === 0) && (num2 % i === 0))
            return false;

    return true;
};


export const rotate = (arr: any[], offset: number): any[] => {
    let copy = arr.slice();
    if (copy.length > offset) {
        copy.unshift(...copy.splice(-offset));
    } else {
        let i = 0;
        while (i < offset) {
            copy.unshift(copy.splice(-1));
            i++;
        }
    }
    return copy;
}


export const inversionMap = (range: (number|number[])): Map<number, number> => {
    let map = new Map();

    const intervals: number[] = (Array.isArray(range)) ?
            range.filter(unique).sort((a, b) => a - b) :
            [...new Array(range).keys()].map(i => i + 1);

    for (let i = 0; i < intervals.length; i++)
        map.set(intervals[i], intervals[intervals.length - i - 1]);

    return map;
}


export const shuffle = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


export const scaleToRange = ( num: number, inputRange: number[], outputRange: number[] ) => {
    return (num - inputRange[0]) * (outputRange[1] - outputRange[0]) / (inputRange[1] - inputRange[0]) + outputRange[0];
}
