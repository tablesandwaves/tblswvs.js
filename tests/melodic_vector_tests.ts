import { expect } from "chai";
import { Key } from "../src/key";

import { MelodicVector } from "../src/melodic_vector";
import { Melody } from "../src/melody";
import { Scale } from "../src/mode";
import * as helpers from "./test_helpers";


describe("MelodicVector", () => {
    describe("is a Sequence", () => {
        const vector = new MelodicVector([1, 0]);
        it("should have steps that can be returned as values", () => expect(vector.steps).to.have.ordered.members([1, 0]));
        it("should have numeric steps", () => vector.steps.forEach(step => expect(step).to.be.a("number")));
    });


    describe("is a Transformation", () => {
        const key = new Key(60, Scale.Minor);

        it("can apply the shift in scale mode", () => {
            const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
                key, [1, 5, 6, 4], [1, 0], "scale"
            );
            expect(transformedMelodyScaleDegs).to.have.ordered.members([2, 5, 7, 4]);
            expect(transformedMelodyMidiNotes).to.have.ordered.members([62, 67, 70, 65]);
        });

        it("can apply the shift in MIDI mode which results in non-scale notes", () => {
            const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
                key, [1, 5, 6, 4], [1, 0], "midi"
            );
            expect(transformedMelodyScaleDegs).to.have.ordered.members([undefined, 5, undefined, 4]);
            expect(transformedMelodyMidiNotes).to.have.ordered.members([61, 67, 69, 65]);
        });

        it("can apply the shift in MIDI mode which results in new scale degrees notes", () => {
            const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
                key, [1, 5, 6, 4], [2, 0], "midi"
            );
            expect(transformedMelodyScaleDegs).to.have.ordered.members([2, 5, 7, 4]);
            expect(transformedMelodyMidiNotes).to.have.ordered.members([62, 67, 70, 65]);
        });

        it("can be applied to a sequence that is not a multiple of the transformation", () => {
            const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
                key, [1, 1, 5, 5, 7], [1, 0], "scale"
            );
            expect(transformedMelodyScaleDegs).to.have.ordered.members([2, 1, 6, 5, 8]);
            expect(transformedMelodyMidiNotes).to.have.ordered.members([62, 60, 68, 67, 72]);
        });

        it("can be applied to a sequence that is smaller than the transformation", () => {
            const [transformedMelodyScaleDegs, transformedMelodyMidiNotes] = helpers.vectorShiftNotesDegrees(
                key, [1], [1, 0], "scale"
            );
            expect(transformedMelodyScaleDegs).to.have.ordered.members([2]);
            expect(transformedMelodyMidiNotes).to.have.ordered.members([62]);
        });

        it("will not shift a rest", () => {
            const notes = [
                { octave: 3, note: 'C', midi: 60, scaleDegree: 1 },
                { octave: -3, note: 'rest', midi: -1 },
                { octave: -3, note: 'rest', midi: -1 },
                { octave: -3, note: 'rest', midi: -1 }
            ]
            const melody = new Melody(notes, key);
            const vector = new MelodicVector([1, 0], "scale");
            const transformedMelody = vector.applyTo(melody).notes.map(n => n.midi);
            expect(transformedMelody).to.have.ordered.members([62, -1, -1, -1]);
        });
    });
});
