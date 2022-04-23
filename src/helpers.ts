export const INCOMPATIBLE_SEQ_MSG = 
    "A Sequence can only be made new from and Array of Sequence " +
    "objects that share the same rest symbol and mode"

export const unique = (value: any, index: number, self: any) => {
    return self.indexOf(value) === index;
}