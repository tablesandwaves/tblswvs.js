import { expect } from "chai";

import { Key } from "../src/key";
import { Scale } from "../src/mode";


describe("Key", () => {
    describe("when created with a MIDI note number tonic", () => {
        let aMinor = new Key(Scale.Minor, 69);

        it("has a letter tonic", () => expect(aMinor.tonic).to.equal("A"));
        it("has a MIDI note number tonic", () => expect(aMinor.midiTonic).to.equal(9));
        it("has an octave based on the MIDI note", () => expect(aMinor.octave).to.equal(3));
    });


    describe("when created with a note letter tonic", () => {
        let dDorian = new Key(Scale.Dorian, "D");

        it("knows its tonic as a letter", () => expect(dDorian.tonic).to.equal("D"));
        it("knows its tonic as a MIDI note number", () => expect(dDorian.midiTonic).to.equal(2));
        it("has the default octave 1", () => expect(dDorian.octave).to.equal(1));
    });


    describe("when getting a key's scale degrees", () => {
        let dDorian = new Key(Scale.Dorian, "D");

        it("knows its scale degrees by numeric accessor", () => {
            expect(dDorian.degree(1)).to.include({octave: 1, note: "D", midi: 38});
            expect(dDorian.degree(2)).to.include({octave: 1, note: "E", midi: 40});
            expect(dDorian.degree(3)).to.include({octave: 1, note: "F", midi: 41});
            expect(dDorian.degree(4)).to.include({octave: 1, note: "G", midi: 43});
            expect(dDorian.degree(5)).to.include({octave: 1, note: "A", midi: 45});
            expect(dDorian.degree(6)).to.include({octave: 1, note: "B", midi: 47});
            expect(dDorian.degree(7)).to.include({octave: 2, note: "C", midi: 48});
        });

        it("replaces a generic sharp note with the scale flat", () => {
            expect(new Key(Scale.Minor, "C").degree(3)).to.include({octave: 1, note: "Eb", midi: 39});
        });

        it("gets the next octave when the degree is higher than the scale's length", () => {
            expect(new Key(Scale.Major, "C").degree(9)).to.include({octave: 2, note: "D", midi: 50});
            expect(new Key(Scale.MinPentatonic, "E").degree(6)).to.include({octave: 2, note: "E", midi: 52});
        });
    });
})
