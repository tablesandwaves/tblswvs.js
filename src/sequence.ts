import { MusicalSymbol } from "./musical_symbol";


export interface Sequence {
    steps: MusicalSymbol[] | number[];
}
