import { MusicalSymbol } from "../src/musical_symbol";


export function getMelodicSteps(steps: (string|number)[]) {
    return steps.map(step => new MusicalSymbol(step));
}
