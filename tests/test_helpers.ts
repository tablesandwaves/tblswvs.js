const fs = require("fs");
const path = require("path");

import { MusicalSymbol } from "../src/musical_symbol";


export function getMelodicSteps(steps: (string|number)[]) {
    return steps.map(step => new MusicalSymbol(step));
}


export function getFileContents(mocksPath: string) {
    let filepath = path.resolve(__dirname, "support", mocksPath);
    return fs.readFileSync(filepath, "utf8");
}
