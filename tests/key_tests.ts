import { expect } from "chai";

import { Key } from "../src/key";
import { Scale } from "../src/mode";
import { TblswvsError } from "../src/tblswvs_error";


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

        it("returns an error for scale degree 0", () => {
            expect(() => { return dDorian.degree(0) }).to.throw(TblswvsError, "Scale degrees must be negative or positive, but not 0");
        });

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

        it("can index scale degrees in reverse order when the degree is less than 0", () => {
            expect(dDorian.degree(-1)).to.include({octave: 1, note: "C", midi: 36});
            expect(dDorian.degree(-2)).to.include({octave: 0, note: "B", midi: 35});
            expect(dDorian.degree(-3)).to.include({octave: 0, note: "A", midi: 33});
            expect(dDorian.degree(-4)).to.include({octave: 0, note: "G", midi: 31});
            expect(dDorian.degree(-5)).to.include({octave: 0, note: "F", midi: 29});
            expect(dDorian.degree(-6)).to.include({octave: 0, note: "E", midi: 28});
            expect(dDorian.degree(-7)).to.include({octave: 0, note: "D", midi: 26});
            expect(dDorian.degree(-8)).to.include({octave: 0, note: "C", midi: 24});
            expect(dDorian.degree(-9)).to.include({octave: -1, note: "B", midi: 23});
        });

        it("replaces a generic sharp note with the scale flat for negative scale degrees", () => {
            expect(new Key("C", Scale.Minor).degree(-1)).to.include({octave: 0, note: "Bb", midi: 34});
            expect(new Key("C", Scale.Minor).degree(-9)).to.include({octave: -1, note: "Ab", midi: 20});
        });

        it("can be given an optional octave transposition", () => {
            expect(dDorian.degree(1, 1)).to.include({octave: 2, note: "D", midi: 50});
            expect(dDorian.degree(-1, 1)).to.include({octave: 2, note: "C", midi: 48});
        });
    });


    describe("when generating chords", () => {
        let cMajor = new Key("C", Scale.Major);
        let cMinor = new Key("C", Scale.Minor);

        describe("in a diatonic scale, it finds", () => {
            it("octave", () => {
                expect(cMajor.chord(1, "oct")).to.deep.include({midi: [36, 48], quality: "oct", root: "C", degree: "1oct", keyTransposition: 0});
            });

            it("power", () => {
                expect(cMajor.chord(2, "pow")).to.deep.include({midi: [38, 45], quality: "pow", root: "D", degree: "2pow", keyTransposition: 0});
            });

            it("major triads", () => {
                expect(cMajor.chord(1, "T")).to.deep.include({midi: [36, 40, 43], quality: "M", root: "C", degree: "I", keyTransposition: 0});
                expect(cMajor.chord(4, "T")).to.deep.include({midi: [41, 45, 48], quality: "M", root: "F", degree: "IV", keyTransposition: 0});
                expect(cMajor.chord(5, "T")).to.deep.include({midi: [43, 47, 50], quality: "M", root: "G", degree: "V", keyTransposition: 0});
            });

            it("minor triads", () => {
                expect(cMajor.chord(2, "T")).to.deep.include({midi: [38, 41, 45], quality: "m", root: "D", degree: "ii", keyTransposition: 0});
                expect(cMajor.chord(3, "T")).to.deep.include({midi: [40, 43, 47], quality: "m", root: "E", degree: "iii", keyTransposition: 0});
                expect(cMajor.chord(6, "T")).to.deep.include({midi: [45, 48, 52], quality: "m", root: "A", degree: "vi", keyTransposition: 0});
            });

            it("diminished triad", () => {
                expect(cMajor.chord(7, "T")).to.deep.include({midi: [47, 50, 53], quality: "dim", root: "B", degree: "viio", keyTransposition: 0});
            });

            it("roots that are flat", () => {
                expect(cMinor.chord(3, "T")).to.deep.include({midi: [39, 43, 46], quality: "M", root: "Eb", degree: "III", keyTransposition: 0});
            });
        });


        describe("in custom, non-heptatonic scales", () => {
            const cMajPent   = new Key("C", Scale.MajPentatonic);
            const cWT        = new Key("C", Scale.WholeTone);
            const cChromatic = new Key("C", Scale.Chromatic);
            const cGS        = new Key("C", Scale.GS);

            it("finds a minor slash chord", () => {
                expect(cMajPent.chord(1, "T")).to.deep.include({midi: [36, 40, 45], quality: "m/3", root: "A", degree: "i/3", keyTransposition: 0});
            });

            it("finds a sus2 slash chord", () => {
                expect(cMajPent.chord(2, "T")).to.deep.include({midi: [38, 43, 48], quality: "sus2/2", root: "C", degree: "IIsus2/2", keyTransposition: 0});
                expect(cMajPent.chord(3, "T")).to.deep.include({midi: [40, 45, 50], quality: "sus2/2", root: "D", degree: "IIIsus2/2", keyTransposition: 0});
                expect(cMajPent.chord(5, "T")).to.deep.include({midi: [45, 50, 55], quality: "sus2/2", root: "G", degree: "Vsus2/2", keyTransposition: 0});
            });

            it("finds a major slash chord", () => {
                expect(cMajPent.chord(4, "T")).to.deep.include({midi: [43, 48, 52], quality: "M/5", root: "C", degree: "IV/5", keyTransposition: 0});
            });

            it("finds an augmented chord", () => {
                expect(cWT.chord(1, "T")).to.deep.include({midi: [36, 40, 44], quality: "aug", root: "C", degree: "I+", keyTransposition: 0});
                expect(cWT.chord(2, "T")).to.deep.include({midi: [38, 42, 46], quality: "aug", root: "D", degree: "II+", keyTransposition: 0});
            });

            it("finds a whole tone chord", () => {
                expect(cChromatic.chord(1, "T")).to.deep.include({midi: [36, 38, 40], quality: "WT", root: "C", degree: "iWT", keyTransposition: 0});
                expect(cChromatic.chord(2, "T")).to.deep.include({midi: [37, 39, 41], quality: "WT", root: "C#", degree: "iiWT", keyTransposition: 0});
            });

            it("finds a chord with a flatted degree", () => {
                expect(cGS.chord(1, "T")).to.deep.include({midi: [36, 39, 41], quality: "m5bb", root: "C", degree: "i5bb", keyTransposition: 0});
                expect(cGS.chord(3, "T")).to.deep.include({midi: [39, 41, 45], quality: "sus25b", root: "Eb", degree: "IIIsus25b", keyTransposition: 0});
            });
        });


        describe("with transpositions", () => {
            it("can shift the chord to a higher octave", () => {
                expect(cMajor.chord(1, "T", 2)).to.deep.include({midi: [60, 64, 67], quality: "M", root: "C", degree: "I", keyTransposition: 2});
            });

            it("can shift the chord to a lower octave", () => {
                expect(cMajor.chord(1, "T", -1)).to.deep.include({midi: [24, 28, 31], quality: "M", root: "C", degree: "I", keyTransposition: -1});
            });
        });
    });


    describe("when translating MIDI notes to scale notes", () => {
        const cMinor = new Key("C", Scale.Minor);

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
