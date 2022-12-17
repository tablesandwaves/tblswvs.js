import { expect } from "chai";

import { Key } from "../src/key";
import { Scale } from "../src/mode";


describe("Key", () => {
    describe("when created with a MIDI note number tonic", () => {
        let aMinor = new Key(69, Scale.Minor);

        it("has a letter tonic", () => expect(aMinor.tonic).to.equal("A"));
        it("has a MIDI note number tonic", () => expect(aMinor.midiTonic).to.equal(9));
        it("has an octave based on the MIDI note", () => expect(aMinor.octave).to.equal(3));
        it("has scale name", () => expect(aMinor.scaleName).to.equal("Minor"));
        it("has a name", () => expect(aMinor.name).to.equal("A Minor"));
    });


    describe("when created with a note letter tonic", () => {
        let dDorian = new Key("D", Scale.Dorian);

        it("knows its tonic as a letter", () => expect(dDorian.tonic).to.equal("D"));
        it("knows its tonic as a MIDI note number", () => expect(dDorian.midiTonic).to.equal(2));
        it("has the default octave 1", () => expect(dDorian.octave).to.equal(1));
    });


    describe("when getting a key's scale degrees", () => {
        let dDorian = new Key("D", Scale.Dorian);

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
            expect(new Key("C", Scale.Minor).degree(3)).to.include({octave: 1, note: "Eb", midi: 39});
        });

        it("gets the next octave when the degree is higher than the scale's length", () => {
            expect(new Key("C", Scale.Major).degree(9)).to.include({octave: 2, note: "D", midi: 50});
            expect(new Key("E", Scale.MinPentatonic).degree(6)).to.include({octave: 2, note: "E", midi: 52});
        });
    });


    describe("when translating MIDI notes to scale notes", () => {
        let cMinor = new Key("C", Scale.Minor);

        it("returns the scale notes", () => {
            expect(cMinor.midi2note(36)).to.equal("C1");
            expect(cMinor.midi2note(38)).to.equal("D1");
            expect(cMinor.midi2note(39)).to.equal("Eb1");
            expect(cMinor.midi2note(41)).to.equal("F1");
            expect(cMinor.midi2note(43)).to.equal("G1");
            expect(cMinor.midi2note(44)).to.equal("Ab1");
            expect(cMinor.midi2note(46)).to.equal("Bb1");
        });

        it("returns a sharp accidental for a sharp/flat note in the scale", () => {
            expect(cMinor.midi2note(37)).to.equal("C#1");
            expect(cMinor.midi2note(42)).to.equal("F#1");
        });

        it("returns a natural accidental for a natural note in the scale", () => {
            expect(cMinor.midi2note(40)).to.equal("E♮1");
            expect(cMinor.midi2note(45)).to.equal("A♮1");
            expect(cMinor.midi2note(47)).to.equal("B♮1");
        });

        it("returns a note from another octave", () => {
            expect(cMinor.midi2note(55)).to.equal("G2");
            expect(cMinor.midi2note(27)).to.equal("Eb0");
            expect(cMinor.midi2note(1)).to.equal("C#-2");
            expect(cMinor.midi2note(28)).to.equal("E♮0");
        });
    });


    describe("can have scale notes", () => {
        it("with no sharps/flats", () => {
            expect(new Key("C", Scale.Major).scaleNotes).to.have.ordered.members(["C", "D", "E", "F", "G", "A", "B"]);
            expect(new Key("A", Scale.Minor).scaleNotes).to.have.ordered.members(["A", "B", "C", "D", "E", "F", "G"]);
        });

        it("with a sharp", () => {
            expect(new Key("G", Scale.Major).scaleNotes).to.have.ordered.members(["G", "A", "B", "C", "D", "E", "F#"]);
        });

        it("with flats", () => {
            expect(new Key("C", Scale.Minor).scaleNotes).to.have.ordered.members(["C", "D", "Eb", "F", "G", "Ab", "Bb"]);
        });

        it("with double sharps", () => {
            expect(new Key("G#", Scale.Major).scaleNotes).to.have.ordered.members(["G#", "A#", "B#", "C#", "D#", "E#", "Fx"]);
        });

        it("for pentatonics (diatonic skips)", () => {
            expect(new Key("F#", Scale.MajPentatonic).scaleNotes).to.have.ordered.members(["F#", "G#", "A#", "C#", "D#"]);
            expect(new Key("E", Scale.MinPentatonic).scaleNotes).to.have.ordered.members(["E", "G", "A", "B", "D"]);
        });

        it("for Whole Tone", () => {
            expect(new Key("C", Scale.WholeTone).scaleNotes).to.have.ordered.members(["C", "D", "E", "F#", "G#", "A#"]);
        });

        it("for Chromatic", () => {
            const expected = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            expect(new Key("C", Scale.Chromatic).scaleNotes).to.have.ordered.members(expected);
        });

        it("for GS", () => {
            const expected = ["C", "Db", "Eb", "Fb", "Gbb", "Ab", "Bbb"];
            expect(new Key("C", Scale.GS).scaleNotes).to.have.ordered.members(expected);
        });
    });

})
