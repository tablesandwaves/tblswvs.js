const fs = require("fs");
const path = require("path");


export function getFileContents(mocksPath: string) {
    let filepath = path.resolve(__dirname, "support", mocksPath);
    return fs.readFileSync(filepath, "utf8");
}


export function isSelfReplicatingAt(sequence: (number|string)[], ratio: number): boolean {
    let index = 0;
    let copy = new Array(sequence.length);

    while (copy.findIndex(n => n == undefined) >= 0) {
        copy[index] = sequence[(index * ratio) % sequence.length];
        index += 1;
    }

    return sequence.length === copy.length && sequence.every((value, index) => value === copy[index]);
}
