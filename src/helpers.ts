import { TblswvsError } from "./tblswvs_error";


export const INCOMPATIBLE_SEQ_MSG =
    "A Sequence can only be made new from and Array of Sequence " +
    "objects that share the same rest symbol and mode";

export const NON_INTEGER_INPUTS = "Numbers must be integers";

export const SELF_SIMILARITY_REQUIRES_COPRIMES =
    "A self-similar melody can only be produced for an input sequence length " +
    "that is coprime with the output sequence length";

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
