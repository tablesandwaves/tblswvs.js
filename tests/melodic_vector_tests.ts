import { expect } from "chai";
import { MelodicVector } from "../src/melodic_vector";
import { Melody } from "../src/melody";
import { MusicalSymbol } from "../src/musical_symbol";


describe("MelodicVector", () => {
    /**
     * Subclasses Sequence
     * * Has access to super data members
     * Numbers Only
     * Shifts a sequences numbers
     */
    // it("should be a sequence")
    const notes  = [1, 5, 6, 4].map(scaleDeg => new MusicalSymbol(scaleDeg));
    const melody = new Melody(notes);
    const vector = new MelodicVector([1, 0]);

    it("should apply to the melody using addition", () => {
        const transformedMelody = vector.applyTo(melody).steps.map(step => step.value);
        expect(transformedMelody).to.have.ordered.members([2, 5, 7, 4]);
    });
});