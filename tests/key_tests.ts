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
        it("has a scale name", () => expect(dDorian.scaleName).to.equal("Dorian"));
        it("has a name", () => expect(dDorian.name).to.equal("D Dorian"));
    });


    describe("when created with a scale name as a string", () => {
        let dDorian = new Key("D", Scale["Dorian"]);

        it("knows its tonic as a letter", () => expect(dDorian.tonic).to.equal("D"));
        it("knows its tonic as a MIDI note number", () => expect(dDorian.midiTonic).to.equal(2));
        it("has the default octave 1", () => expect(dDorian.octave).to.equal(1));
        it("has a scale name", () => expect(dDorian.scaleName).to.equal("Dorian"));
        it("has a name", () => expect(dDorian.name).to.equal("D Dorian"));
    });


    describe("when getting a key's scale degrees", () => {
        let dDorian = new Key("D", Scale.Dorian);
        let cMinor  = new Key(60, Scale.Minor);

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

        it("can index negative scale degrees for scales with flatted note names", () => {
            expect(cMinor.degree(-1)).to.include({octave: 2, note: "Bb", midi: 58});
            expect(cMinor.degree(-2)).to.include({octave: 2, note: "Ab", midi: 56});
            expect(cMinor.degree(-3)).to.include({octave: 2, note: "G", midi: 55});
            expect(cMinor.degree(-4)).to.include({octave: 2, note: "F", midi: 53});
            expect(cMinor.degree(-5)).to.include({octave: 2, note: "Eb", midi: 51});
            expect(cMinor.degree(-6)).to.include({octave: 2, note: "D", midi: 50});
            expect(cMinor.degree(-7)).to.include({octave: 2, note: "C", midi: 48});
            expect(cMinor.degree(-8)).to.include({octave: 1, note: "Bb", midi: 46});
            expect(cMinor.degree(-9)).to.include({octave: 1, note: "Ab", midi: 44});
        });
    });


    describe("when generating inversions for scale degree intervals", () => {
        let cMinor  = new Key(60, Scale.Minor);

        it("finds the inversions within the root octave", () => {
            expect(cMinor.degreeInversion(1)).to.include({octave: 4, note: "C", midi: 72});
            expect(cMinor.degreeInversion(2)).to.include({octave: 3, note: "Bb", midi: 70});
            expect(cMinor.degreeInversion(3)).to.include({octave: 3, note: "Ab", midi: 68});
            expect(cMinor.degreeInversion(4)).to.include({octave: 3, note: "G", midi: 67});
            expect(cMinor.degreeInversion(5)).to.include({octave: 3, note: "F", midi: 65});
            expect(cMinor.degreeInversion(6)).to.include({octave: 3, note: "Eb", midi: 63});
            expect(cMinor.degreeInversion(7)).to.include({octave: 3, note: "D", midi: 62});
            expect(cMinor.degreeInversion(8)).to.include({octave: 3, note: "C", midi: 60});
        });

        it("has an inversion range of +/- one octave around the Key's root octave", () => {
            expect(cMinor.degreeInversion(-1)).to.include({octave: 4, note: "D", midi: 74});
            expect(cMinor.degreeInversion(9)).to.include({octave: 2, note: "Bb", midi: 58});
            expect(cMinor.degreeInversion(-7)).to.include({octave: 5, note: "C", midi: 84});
            expect(cMinor.degreeInversion(15)).to.include({octave: 2, note: "C", midi: 48});
        });

        it("clamps intervals outside of the +/- 1 octave range to range low/high and inverts them", () => {
            expect(cMinor.degreeInversion(-8)).to.include({octave: 5, note: "C", midi: 84});
            expect(cMinor.degreeInversion(-24)).to.include({octave: 5, note: "C", midi: 84});
            expect(cMinor.degreeInversion(16)).to.include({octave: 2, note: "C", midi: 48});
            expect(cMinor.degreeInversion(24)).to.include({octave: 2, note: "C", midi: 48});
        });
    });


    describe("when generating chords", () => {
        let cMajor      = new Key("C", Scale.Major);
        let cMinor      = new Key("C", Scale.Minor);
        let gDorian     = new Key(55, Scale.Dorian);
        let cSharpMinor = new Key(61, Scale.Minor);
        let dMinPent    = new Key(50, Scale.MinPentatonic);
        let cDiminished = new Key("C", Scale.Diminished);

        describe("requesting a chord for degree 0", () => {
            it("returns an error for scale degree 0", () => {
                expect(() => { return cMinor.chord(0, "T") }).to.throw(TblswvsError, "Scale degrees must be negative or positive, but not 0");
            });
        });


        describe("in a diatonic scale, it finds", () => {
            it("octave", () => {
                expect(cMajor.chord(1, "oct")).to.deep.include({midi: [36, 48], quality: "oct", root: "C", degree: "1"});
            });

            it("power", () => {
                expect(cMajor.chord(2, "pow")).to.deep.include({midi: [38, 45], quality: "P5", root: "D", degree: "2"});
            });

            it("major triads", () => {
                expect(cMajor.chord(1, "T")).to.deep.include({midi: [36, 40, 43], quality: "M", root: "C", degree: "I"});
                expect(cMajor.chord(4, "T")).to.deep.include({midi: [41, 45, 48], quality: "M", root: "F", degree: "IV"});
                expect(cMajor.chord(5, "T")).to.deep.include({midi: [43, 47, 50], quality: "M", root: "G", degree: "V"});
            });

            it("minor triads", () => {
                expect(cMajor.chord(2, "T")).to.deep.include({midi: [38, 41, 45], quality: "m", root: "D", degree: "ii"});
                expect(cMajor.chord(3, "T")).to.deep.include({midi: [40, 43, 47], quality: "m", root: "E", degree: "iii"});
                expect(cMajor.chord(6, "T")).to.deep.include({midi: [45, 48, 52], quality: "m", root: "A", degree: "vi"});
            });

            it("diminished triad", () => {
                expect(cMajor.chord(7, "T")).to.deep.include({midi: [47, 50, 53], quality: "dim", root: "B", degree: "viio"});
            });

            it("roots that are flat", () => {
                expect(cMinor.chord(3, "T")).to.deep.include({midi: [39, 43, 46], quality: "M", root: "Eb", degree: "III"});
            });

            it("maps the chord roots correctly for non-C", () => {
                expect(gDorian.chord(1, "T")).to.deep.include({midi: [55, 58, 62], quality: "m", root: "G", degree: "i"});
                expect(gDorian.chord(2, "T")).to.deep.include({midi: [57, 60, 64], quality: "m", root: "A", degree: "ii"});
                expect(gDorian.chord(3, "T")).to.deep.include({midi: [58, 62, 65], quality: "M", root: "Bb", degree: "III"});
                expect(gDorian.chord(4, "T")).to.deep.include({midi: [60, 64, 67], quality: "M", root: "C", degree: "IV"});
                expect(gDorian.chord(5, "T")).to.deep.include({midi: [62, 65, 69], quality: "m", root: "D", degree: "v"});
                expect(gDorian.chord(6, "T")).to.deep.include({midi: [64, 67, 70], quality: "dim", root: "E", degree: "vio"});
                expect(gDorian.chord(7, "T")).to.deep.include({midi: [65, 69, 72], quality: "M", root: "F", degree: "VII"});
                expect(cSharpMinor.chord(1, "T")).to.deep.include({midi: [61, 64, 68], quality: "m", root: "C#", degree: "i"});
                expect(cSharpMinor.chord(2, "T")).to.deep.include({midi: [63, 66, 69], quality: "dim", root: "D#", degree: "iio"});
                expect(cSharpMinor.chord(3, "T")).to.deep.include({midi: [64, 68, 71], quality: "M", root: "E", degree: "III"});
                expect(cSharpMinor.chord(4, "T")).to.deep.include({midi: [66, 69, 73], quality: "m", root: "F#", degree: "iv"});
                expect(cSharpMinor.chord(5, "T")).to.deep.include({midi: [68, 71, 75], quality: "m", root: "G#", degree: "v"});
                expect(cSharpMinor.chord(6, "T")).to.deep.include({midi: [69, 73, 76], quality: "M", root: "A", degree: "VI"});
                expect(cSharpMinor.chord(7, "T")).to.deep.include({midi: [71, 75, 78], quality: "M", root: "B", degree: "VII"});
            });

            it("chords for scale degrees above the octave range map correctly", () => {
                expect(dMinPent.chord(10, "T")).to.deep.include({midi: [72, 77, 81], quality: "-", root: "C", degree: "5"});
                expect(cMinor.chord(8, "T")).to.deep.include({midi: [48, 51, 55], quality: "m", root: "C", degree: "i"});
                expect(cMinor.chord(9, "T")).to.deep.include({midi: [50, 53, 56], quality: "dim", root: "D", degree: "iio"});
            });
        });


        describe("in custom, non-heptatonic scales", () => {
            const cMajPent    = new Key("C", Scale.MajPentatonic);
            const cWT         = new Key("C", Scale.WholeTone);
            const cChromatic  = new Key("C", Scale.Chromatic);
            const cGS         = new Key("C", Scale.GS);

            it("finds a minor slash chord", () => {
                expect(cMajPent.chord(1, "T")).to.deep.include({midi: [36, 40, 45], quality: "-", root: "C", degree: "1"});
            });

            it("finds a sus2 slash chord", () => {
                expect(cMajPent.chord(2, "T")).to.deep.include({midi: [38, 43, 48], quality: "-", root: "D", degree: "2"});
                expect(cMajPent.chord(3, "T")).to.deep.include({midi: [40, 45, 50], quality: "-", root: "E", degree: "3"});
                expect(cMajPent.chord(5, "T")).to.deep.include({midi: [45, 50, 55], quality: "-", root: "A", degree: "5"});
            });

            it("finds a major slash chord", () => {
                expect(cMajPent.chord(4, "T")).to.deep.include({midi: [43, 48, 52], quality: "-", root: "G", degree: "4"});
            });

            it("finds an augmented chord", () => {
                expect(cWT.chord(1, "T")).to.deep.include({midi: [36, 40, 44], quality: "aug", root: "C", degree: "I+"});
                expect(cWT.chord(2, "T")).to.deep.include({midi: [38, 42, 46], quality: "aug", root: "D", degree: "II+"});
            });

            it("finds a whole tone chord", () => {
                expect(cChromatic.chord(1, "T")).to.deep.include({midi: [36, 38, 40], quality: "-", root: "C", degree: "1"});
                expect(cChromatic.chord(2, "T")).to.deep.include({midi: [37, 39, 41], quality: "-", root: "C#", degree: "2"});
            });

            it("finds a chord with a flatted degree", () => {
                expect(cGS.chord(1, "T")).to.deep.include({midi: [36, 39, 41], quality: "-", root: "C", degree: "1"});
                expect(cGS.chord(3, "T")).to.deep.include({midi: [39, 41, 45], quality: "-", root: "Eb", degree: "3"});
            });
        });


        describe("with transpositions", () => {
            it("can shift the chord to a higher octave", () => {
                expect(cMajor.chord(1, "T", 2)).to.deep.include({midi: [60, 64, 67], quality: "M", root: "C", degree: "I"});
            });

            it("can shift the chord to a higher octave using a scale degree higher than the scale's degree count", () => {
                expect(cMajor.chord(8, "T")).to.deep.include({midi: [48, 52, 55], quality: "M", root: "C", degree: "I"});
            });

            it("can shift the chord to a lower octave", () => {
                expect(cMajor.chord(1, "T", -1)).to.deep.include({midi: [24, 28, 31], quality: "M", root: "C", degree: "I"});
            });
        });


        describe("generating chords for negative scale degrees", () => {
            it("can use a negative scale degree index", () => {
                expect(cMinor.chord(-4, "T")).to.deep.include({midi: [29, 32, 36], quality: "m", root: "F", degree: "iv"});
            });

            it("can use a negative scale degree index beyond the first negative octave", () => {
                expect(cMinor.chord(-11, "T")).to.deep.include({midi: [17, 20, 24], quality: "m", root: "F", degree: "iv"});
            });

            it("finds a chord below the octave", () => {
                expect(cDiminished.chord(-1, "T")).to.deep.include({midi: [35, 38, 41], quality: "dim", root: "B", degree: "viiio"});
            });
        });


        describe("generating dyads", () => {
            describe("for a heptatonic scale", () => {
                let cMajor      = new Key("C", Scale.Major);
                let cMinor      = new Key("C", Scale.Minor);
                let gDorian     = new Key(55, Scale.Dorian);

                it("generates major scale 2-dyads", () => {
                    expect(cMajor.chord(1, "dyad2")).to.deep.include({midi: [36, 38], quality: "M2", root: "C", degree: "I2"});
                    expect(cMajor.chord(2, "dyad2")).to.deep.include({midi: [38, 40], quality: "M2", root: "D", degree: "II2"});
                    expect(cMajor.chord(3, "dyad2")).to.deep.include({midi: [40, 41], quality: "m2", root: "E", degree: "iii2"});
                    expect(cMajor.chord(4, "dyad2")).to.deep.include({midi: [41, 43], quality: "M2", root: "F", degree: "IV2"});
                    expect(cMajor.chord(5, "dyad2")).to.deep.include({midi: [43, 45], quality: "M2", root: "G", degree: "V2"});
                    expect(cMajor.chord(6, "dyad2")).to.deep.include({midi: [45, 47], quality: "M2", root: "A", degree: "VI2"});
                    expect(cMajor.chord(7, "dyad2")).to.deep.include({midi: [47, 48], quality: "m2", root: "B", degree: "vii2"});
                });

                it("generates minor scale 2-dyads", () => {
                    expect(cMinor.chord(1, "dyad2")).to.deep.include({midi: [36, 38], quality: "M2", root: "C", degree: "I2"});
                    expect(cMinor.chord(2, "dyad2")).to.deep.include({midi: [38, 39], quality: "m2", root: "D", degree: "ii2"});
                    expect(cMinor.chord(3, "dyad2")).to.deep.include({midi: [39, 41], quality: "M2", root: "Eb", degree: "III2"});
                    expect(cMinor.chord(4, "dyad2")).to.deep.include({midi: [41, 43], quality: "M2", root: "F", degree: "IV2"});
                    expect(cMinor.chord(5, "dyad2")).to.deep.include({midi: [43, 44], quality: "m2", root: "G", degree: "v2"});
                    expect(cMinor.chord(6, "dyad2")).to.deep.include({midi: [44, 46], quality: "M2", root: "Ab", degree: "VI2"});
                    expect(cMinor.chord(7, "dyad2")).to.deep.include({midi: [46, 48], quality: "M2", root: "Bb", degree: "VII2"});
                });

                it("generates major scale 3-dyads", () => {
                    expect(cMajor.chord(1, "dyad3")).to.deep.include({midi: [36, 40], quality: "M3", root: "C", degree: "I3"});
                    expect(cMajor.chord(2, "dyad3")).to.deep.include({midi: [38, 41], quality: "m3", root: "D", degree: "ii3"});
                    expect(cMajor.chord(3, "dyad3")).to.deep.include({midi: [40, 43], quality: "m3", root: "E", degree: "iii3"});
                    expect(cMajor.chord(4, "dyad3")).to.deep.include({midi: [41, 45], quality: "M3", root: "F", degree: "IV3"});
                    expect(cMajor.chord(5, "dyad3")).to.deep.include({midi: [43, 47], quality: "M3", root: "G", degree: "V3"});
                    expect(cMajor.chord(6, "dyad3")).to.deep.include({midi: [45, 48], quality: "m3", root: "A", degree: "vi3"});
                    expect(cMajor.chord(7, "dyad3")).to.deep.include({midi: [47, 50], quality: "m3", root: "B", degree: "vii3"});
                });

                it("generates minor scale 3-dyads", () => {
                    expect(cMinor.chord(1, "dyad3")).to.deep.include({midi: [36, 39], quality: "m3", root: "C",  degree: "i3"});
                    expect(cMinor.chord(2, "dyad3")).to.deep.include({midi: [38, 41], quality: "m3", root: "D",  degree: "ii3"});
                    expect(cMinor.chord(3, "dyad3")).to.deep.include({midi: [39, 43], quality: "M3", root: "Eb", degree: "III3"});
                    expect(cMinor.chord(4, "dyad3")).to.deep.include({midi: [41, 44], quality: "m3", root: "F",  degree: "iv3"});
                    expect(cMinor.chord(5, "dyad3")).to.deep.include({midi: [43, 46], quality: "m3", root: "G",  degree: "v3"});
                    expect(cMinor.chord(6, "dyad3")).to.deep.include({midi: [44, 48], quality: "M3", root: "Ab", degree: "VI3"});
                    expect(cMinor.chord(7, "dyad3")).to.deep.include({midi: [46, 50], quality: "M3", root: "Bb", degree: "VII3"});
                });

                it("generates major scale 4-dyads", () => {
                    expect(cMajor.chord(1, "dyad4")).to.deep.include({midi: [36, 41], quality: "P4",   root: "C", degree: "1"});
                    expect(cMajor.chord(2, "dyad4")).to.deep.include({midi: [38, 43], quality: "P4",   root: "D", degree: "2"});
                    expect(cMajor.chord(3, "dyad4")).to.deep.include({midi: [40, 45], quality: "P4",   root: "E", degree: "3"});
                    expect(cMajor.chord(4, "dyad4")).to.deep.include({midi: [41, 47], quality: "dim5", root: "F", degree: "iv5o"});
                    expect(cMajor.chord(5, "dyad4")).to.deep.include({midi: [43, 48], quality: "P4",   root: "G", degree: "5"});
                    expect(cMajor.chord(6, "dyad4")).to.deep.include({midi: [45, 50], quality: "P4",   root: "A", degree: "6"});
                    expect(cMajor.chord(7, "dyad4")).to.deep.include({midi: [47, 52], quality: "P4",   root: "B", degree: "7"});
                });

                it("generates minor scale 4-dyads", () => {
                    expect(cMinor.chord(1, "dyad4")).to.deep.include({midi: [36, 41], quality: "P4",   root: "C",  degree: "1"});
                    expect(cMinor.chord(2, "dyad4")).to.deep.include({midi: [38, 43], quality: "P4",   root: "D",  degree: "2"});
                    expect(cMinor.chord(3, "dyad4")).to.deep.include({midi: [39, 44], quality: "P4",   root: "Eb", degree: "3"});
                    expect(cMinor.chord(4, "dyad4")).to.deep.include({midi: [41, 46], quality: "P4",   root: "F",  degree: "4"});
                    expect(cMinor.chord(5, "dyad4")).to.deep.include({midi: [43, 48], quality: "P4",   root: "G",  degree: "5"});
                    expect(cMinor.chord(6, "dyad4")).to.deep.include({midi: [44, 50], quality: "dim5", root: "Ab", degree: "vi5o"});
                    expect(cMinor.chord(7, "dyad4")).to.deep.include({midi: [46, 51], quality: "P4",   root: "Bb", degree: "7"});
                });

                it("generates major scale 5-dyads", () => {
                    expect(cMajor.chord(1, "dyad5")).to.deep.include({midi: [36, 43], quality: "P5",   root: "C", degree: "1"});
                    expect(cMajor.chord(2, "dyad5")).to.deep.include({midi: [38, 45], quality: "P5",   root: "D", degree: "2"});
                    expect(cMajor.chord(3, "dyad5")).to.deep.include({midi: [40, 47], quality: "P5",   root: "E", degree: "3"});
                    expect(cMajor.chord(4, "dyad5")).to.deep.include({midi: [41, 48], quality: "P5",   root: "F", degree: "4"});
                    expect(cMajor.chord(5, "dyad5")).to.deep.include({midi: [43, 50], quality: "P5",   root: "G", degree: "5"});
                    expect(cMajor.chord(6, "dyad5")).to.deep.include({midi: [45, 52], quality: "P5",   root: "A", degree: "6"});
                    expect(cMajor.chord(7, "dyad5")).to.deep.include({midi: [47, 53], quality: "dim5", root: "B", degree: "vii5o"});
                });

                it("generates minor scale 5-dyads", () => {
                    expect(cMinor.chord(1, "dyad5")).to.deep.include({midi: [36, 43], quality: "P5",   root: "C",  degree: "1"});
                    expect(cMinor.chord(2, "dyad5")).to.deep.include({midi: [38, 44], quality: "dim5", root: "D",  degree: "ii5o"});
                    expect(cMinor.chord(3, "dyad5")).to.deep.include({midi: [39, 46], quality: "P5",   root: "Eb", degree: "3"});
                    expect(cMinor.chord(4, "dyad5")).to.deep.include({midi: [41, 48], quality: "P5",   root: "F",  degree: "4"});
                    expect(cMinor.chord(5, "dyad5")).to.deep.include({midi: [43, 50], quality: "P5",   root: "G",  degree: "5"});
                    expect(cMinor.chord(6, "dyad5")).to.deep.include({midi: [44, 51], quality: "P5",   root: "Ab", degree: "6"});
                    expect(cMinor.chord(7, "dyad5")).to.deep.include({midi: [46, 53], quality: "P5",   root: "Bb", degree: "7"});
                });

                it("generates major scale 6-dyads", () => {
                    expect(cMajor.chord(1, "dyad6")).to.deep.include({midi: [36, 45], quality: "M6", root: "C", degree: "I6"});
                    expect(cMajor.chord(2, "dyad6")).to.deep.include({midi: [38, 47], quality: "M6", root: "D", degree: "II6"});
                    expect(cMajor.chord(3, "dyad6")).to.deep.include({midi: [40, 48], quality: "m6", root: "E", degree: "iii6"});
                    expect(cMajor.chord(4, "dyad6")).to.deep.include({midi: [41, 50], quality: "M6", root: "F", degree: "IV6"});
                    expect(cMajor.chord(5, "dyad6")).to.deep.include({midi: [43, 52], quality: "M6", root: "G", degree: "V6"});
                    expect(cMajor.chord(6, "dyad6")).to.deep.include({midi: [45, 53], quality: "m6", root: "A", degree: "vi6"});
                    expect(cMajor.chord(7, "dyad6")).to.deep.include({midi: [47, 55], quality: "m6", root: "B", degree: "vii6"});
                });

                it("generates minor scale 6-dyads", () => {
                    expect(cMinor.chord(1, "dyad6")).to.deep.include({midi: [36, 44], quality: "m6", root: "C",  degree: "i6"});
                    expect(cMinor.chord(2, "dyad6")).to.deep.include({midi: [38, 46], quality: "m6", root: "D",  degree: "ii6"});
                    expect(cMinor.chord(3, "dyad6")).to.deep.include({midi: [39, 48], quality: "M6", root: "Eb", degree: "III6"});
                    expect(cMinor.chord(4, "dyad6")).to.deep.include({midi: [41, 50], quality: "M6", root: "F",  degree: "IV6"});
                    expect(cMinor.chord(5, "dyad6")).to.deep.include({midi: [43, 51], quality: "m6", root: "G",  degree: "v6"});
                    expect(cMinor.chord(6, "dyad6")).to.deep.include({midi: [44, 53], quality: "M6", root: "Ab", degree: "VI6"});
                    expect(cMinor.chord(7, "dyad6")).to.deep.include({midi: [46, 55], quality: "M6", root: "Bb", degree: "VII6"});
                });

                it("generates major scale 7-dyads", () => {
                    expect(cMajor.chord(1, "dyad7")).to.deep.include({midi: [36, 47], quality: "M7", root: "C", degree: "I7"});
                    expect(cMajor.chord(2, "dyad7")).to.deep.include({midi: [38, 48], quality: "m7", root: "D", degree: "ii7"});
                    expect(cMajor.chord(3, "dyad7")).to.deep.include({midi: [40, 50], quality: "m7", root: "E", degree: "iii7"});
                    expect(cMajor.chord(4, "dyad7")).to.deep.include({midi: [41, 52], quality: "M7", root: "F", degree: "IV7"});
                    expect(cMajor.chord(5, "dyad7")).to.deep.include({midi: [43, 53], quality: "m7", root: "G", degree: "v7"});
                    expect(cMajor.chord(6, "dyad7")).to.deep.include({midi: [45, 55], quality: "m7", root: "A", degree: "vi7"});
                    expect(cMajor.chord(7, "dyad7")).to.deep.include({midi: [47, 57], quality: "m7", root: "B", degree: "vii7"});
                });

                it("generates minor scale 7-dyads", () => {
                    expect(cMinor.chord(1, "dyad7")).to.deep.include({midi: [36, 46], quality: "m7", root: "C",  degree: "i7"});
                    expect(cMinor.chord(2, "dyad7")).to.deep.include({midi: [38, 48], quality: "m7", root: "D",  degree: "ii7"});
                    expect(cMinor.chord(3, "dyad7")).to.deep.include({midi: [39, 50], quality: "M7", root: "Eb", degree: "III7"});
                    expect(cMinor.chord(4, "dyad7")).to.deep.include({midi: [41, 51], quality: "m7", root: "F",  degree: "iv7"});
                    expect(cMinor.chord(5, "dyad7")).to.deep.include({midi: [43, 53], quality: "m7", root: "G",  degree: "v7"});
                    expect(cMinor.chord(6, "dyad7")).to.deep.include({midi: [44, 55], quality: "M7", root: "Ab", degree: "VI7"});
                    expect(cMinor.chord(7, "dyad7")).to.deep.include({midi: [46, 56], quality: "m7", root: "Bb", degree: "vii7"});
                });

                it("generates major scale 8-dyads", () => {
                    expect(cMajor.chord(1, "dyad8")).to.deep.include({midi: [36, 48], quality: "oct", root: "C", degree: "1"});
                    expect(cMajor.chord(2, "dyad8")).to.deep.include({midi: [38, 50], quality: "oct", root: "D", degree: "2"});
                    expect(cMajor.chord(3, "dyad8")).to.deep.include({midi: [40, 52], quality: "oct", root: "E", degree: "3"});
                    expect(cMajor.chord(4, "dyad8")).to.deep.include({midi: [41, 53], quality: "oct", root: "F", degree: "4"});
                    expect(cMajor.chord(5, "dyad8")).to.deep.include({midi: [43, 55], quality: "oct", root: "G", degree: "5"});
                    expect(cMajor.chord(6, "dyad8")).to.deep.include({midi: [45, 57], quality: "oct", root: "A", degree: "6"});
                    expect(cMajor.chord(7, "dyad8")).to.deep.include({midi: [47, 59], quality: "oct", root: "B", degree: "7"});
                });

                it("generates minor scale 8-dyads", () => {
                    expect(cMinor.chord(1, "dyad8")).to.deep.include({midi: [36, 48], quality: "oct", root: "C",  degree: "1"});
                    expect(cMinor.chord(2, "dyad8")).to.deep.include({midi: [38, 50], quality: "oct", root: "D",  degree: "2"});
                    expect(cMinor.chord(3, "dyad8")).to.deep.include({midi: [39, 51], quality: "oct", root: "Eb", degree: "3"});
                    expect(cMinor.chord(4, "dyad8")).to.deep.include({midi: [41, 53], quality: "oct", root: "F",  degree: "4"});
                    expect(cMinor.chord(5, "dyad8")).to.deep.include({midi: [43, 55], quality: "oct", root: "G",  degree: "5"});
                    expect(cMinor.chord(6, "dyad8")).to.deep.include({midi: [44, 56], quality: "oct", root: "Ab", degree: "6"});
                    expect(cMinor.chord(7, "dyad8")).to.deep.include({midi: [46, 58], quality: "oct", root: "Bb", degree: "7"});
                });

                it("generates major scale 9-dyads", () => {
                    expect(cMajor.chord(1, "dyad9")).to.deep.include({midi: [36, 50], quality: "M9", root: "C", degree: "I9"});
                    expect(cMajor.chord(2, "dyad9")).to.deep.include({midi: [38, 52], quality: "M9", root: "D", degree: "II9"});
                    expect(cMajor.chord(3, "dyad9")).to.deep.include({midi: [40, 53], quality: "m9", root: "E", degree: "iii9"});
                    expect(cMajor.chord(4, "dyad9")).to.deep.include({midi: [41, 55], quality: "M9", root: "F", degree: "IV9"});
                    expect(cMajor.chord(5, "dyad9")).to.deep.include({midi: [43, 57], quality: "M9", root: "G", degree: "V9"});
                    expect(cMajor.chord(6, "dyad9")).to.deep.include({midi: [45, 59], quality: "M9", root: "A", degree: "VI9"});
                    expect(cMajor.chord(7, "dyad9")).to.deep.include({midi: [47, 60], quality: "m9", root: "B", degree: "vii9"});
                });

                it("generates minor scale 9-dyads", () => {
                    expect(cMinor.chord(1, "dyad9")).to.deep.include({midi: [36, 50], quality: "M9", root: "C",  degree: "I9"});
                    expect(cMinor.chord(2, "dyad9")).to.deep.include({midi: [38, 51], quality: "m9", root: "D",  degree: "ii9"});
                    expect(cMinor.chord(3, "dyad9")).to.deep.include({midi: [39, 53], quality: "M9", root: "Eb", degree: "III9"});
                    expect(cMinor.chord(4, "dyad9")).to.deep.include({midi: [41, 55], quality: "M9", root: "F",  degree: "IV9"});
                    expect(cMinor.chord(5, "dyad9")).to.deep.include({midi: [43, 56], quality: "m9", root: "G",  degree: "v9"});
                    expect(cMinor.chord(6, "dyad9")).to.deep.include({midi: [44, 58], quality: "M9", root: "Ab", degree: "VI9"});
                    expect(cMinor.chord(7, "dyad9")).to.deep.include({midi: [46, 60], quality: "M9", root: "Bb", degree: "VII9"});
                });

                it("generates major scale 10-dyads", () => {
                    expect(cMajor.chord(1, "dyad10")).to.deep.include({midi: [36, 52], quality: "M10", root: "C", degree: "I10"});
                    expect(cMajor.chord(2, "dyad10")).to.deep.include({midi: [38, 53], quality: "m10", root: "D", degree: "ii10"});
                    expect(cMajor.chord(3, "dyad10")).to.deep.include({midi: [40, 55], quality: "m10", root: "E", degree: "iii10"});
                    expect(cMajor.chord(4, "dyad10")).to.deep.include({midi: [41, 57], quality: "M10", root: "F", degree: "IV10"});
                    expect(cMajor.chord(5, "dyad10")).to.deep.include({midi: [43, 59], quality: "M10", root: "G", degree: "V10"});
                    expect(cMajor.chord(6, "dyad10")).to.deep.include({midi: [45, 60], quality: "m10", root: "A", degree: "vi10"});
                    expect(cMajor.chord(7, "dyad10")).to.deep.include({midi: [47, 62], quality: "m10", root: "B", degree: "vii10"});
                });

                it("generates minor scale 10-dyads", () => {
                    expect(cMinor.chord(1, "dyad10")).to.deep.include({midi: [36, 51], quality: "m10", root: "C",  degree: "i10"});
                    expect(cMinor.chord(2, "dyad10")).to.deep.include({midi: [38, 53], quality: "m10", root: "D",  degree: "ii10"});
                    expect(cMinor.chord(3, "dyad10")).to.deep.include({midi: [39, 55], quality: "M10", root: "Eb", degree: "III10"});
                    expect(cMinor.chord(4, "dyad10")).to.deep.include({midi: [41, 56], quality: "m10", root: "F",  degree: "iv10"});
                    expect(cMinor.chord(5, "dyad10")).to.deep.include({midi: [43, 58], quality: "m10", root: "G",  degree: "v10"});
                    expect(cMinor.chord(6, "dyad10")).to.deep.include({midi: [44, 60], quality: "M10", root: "Ab", degree: "VI10"});
                    expect(cMinor.chord(7, "dyad10")).to.deep.include({midi: [46, 62], quality: "M10", root: "Bb", degree: "VII10"});
                });

                it("generates major scale 11-dyads", () => {
                    expect(cMajor.chord(1, "dyad11")).to.deep.include({midi: [36, 53], quality: "m11", root: "C", degree: "i11"});
                    expect(cMajor.chord(2, "dyad11")).to.deep.include({midi: [38, 55], quality: "m11", root: "D", degree: "ii11"});
                    expect(cMajor.chord(3, "dyad11")).to.deep.include({midi: [40, 57], quality: "m11", root: "E", degree: "iii11"});
                    expect(cMajor.chord(4, "dyad11")).to.deep.include({midi: [41, 59], quality: "M11", root: "F", degree: "IV11"});
                    expect(cMajor.chord(5, "dyad11")).to.deep.include({midi: [43, 60], quality: "m11", root: "G", degree: "v11"});
                    expect(cMajor.chord(6, "dyad11")).to.deep.include({midi: [45, 62], quality: "m11", root: "A", degree: "vi11"});
                    expect(cMajor.chord(7, "dyad11")).to.deep.include({midi: [47, 64], quality: "m11", root: "B", degree: "vii11"});
                });

                it("generates minor scale 11-dyads", () => {
                    expect(cMinor.chord(1, "dyad11")).to.deep.include({midi: [36, 53], quality: "m11", root: "C",  degree: "i11"});
                    expect(cMinor.chord(2, "dyad11")).to.deep.include({midi: [38, 55], quality: "m11", root: "D",  degree: "ii11"});
                    expect(cMinor.chord(3, "dyad11")).to.deep.include({midi: [39, 56], quality: "m11", root: "Eb", degree: "iii11"});
                    expect(cMinor.chord(4, "dyad11")).to.deep.include({midi: [41, 58], quality: "m11", root: "F",  degree: "iv11"});
                    expect(cMinor.chord(5, "dyad11")).to.deep.include({midi: [43, 60], quality: "m11", root: "G",  degree: "v11"});
                    expect(cMinor.chord(6, "dyad11")).to.deep.include({midi: [44, 62], quality: "M11", root: "Ab", degree: "VI11"});
                    expect(cMinor.chord(7, "dyad11")).to.deep.include({midi: [46, 63], quality: "m11", root: "Bb", degree: "vii11"});
                });

                it("generates major scale 12-dyads", () => {
                    expect(cMajor.chord(1, "dyad12")).to.deep.include({midi: [36, 55], quality: "m12", root: "C", degree: "i12"});
                    expect(cMajor.chord(2, "dyad12")).to.deep.include({midi: [38, 57], quality: "m12", root: "D", degree: "ii12"});
                    expect(cMajor.chord(3, "dyad12")).to.deep.include({midi: [40, 59], quality: "m12", root: "E", degree: "iii12"});
                    expect(cMajor.chord(4, "dyad12")).to.deep.include({midi: [41, 60], quality: "m12", root: "F", degree: "iv12"});
                    expect(cMajor.chord(5, "dyad12")).to.deep.include({midi: [43, 62], quality: "m12", root: "G", degree: "v12"});
                    expect(cMajor.chord(6, "dyad12")).to.deep.include({midi: [45, 64], quality: "m12", root: "A", degree: "vi12"});
                    expect(cMajor.chord(7, "dyad12")).to.deep.include({midi: [47, 65], quality: "M11", root: "B", degree: "VII11"});
                });

                it("generates minor scale 12-dyads", () => {
                    expect(cMinor.chord(1, "dyad12")).to.deep.include({midi: [36, 55], quality: "m12", root: "C",  degree: "i12"});
                    expect(cMinor.chord(2, "dyad12")).to.deep.include({midi: [38, 56], quality: "M11", root: "D",  degree: "II11"});
                    expect(cMinor.chord(3, "dyad12")).to.deep.include({midi: [39, 58], quality: "m12", root: "Eb", degree: "iii12"});
                    expect(cMinor.chord(4, "dyad12")).to.deep.include({midi: [41, 60], quality: "m12", root: "F",  degree: "iv12"});
                    expect(cMinor.chord(5, "dyad12")).to.deep.include({midi: [43, 62], quality: "m12", root: "G",  degree: "v12"});
                    expect(cMinor.chord(6, "dyad12")).to.deep.include({midi: [44, 63], quality: "m12", root: "Ab", degree: "vi12"});
                    expect(cMinor.chord(7, "dyad12")).to.deep.include({midi: [46, 65], quality: "m12", root: "Bb", degree: "vii12"});
                });
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

        it("returns a natural in a scale with three half step intervals", () => {
            const gs = new Key(50, Scale.GS);
            expect(gs.midi2note(60)).to.equal("C♮3");
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

        it("for Diminished", () => {
            expect(new Key("C", Scale.Diminished).scaleNotes).to.have.ordered.members(["C", "D", "Eb", "F", "Gb", "G#", "A", "B"]);
        });

        it("for Chromatic", () => {
            const expected = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            expect(new Key("C", Scale.Chromatic).scaleNotes).to.have.ordered.members(expected);
        });

        it("for GS", () => {
            let expected;
            expected = ["C", "Db", "Eb", "Fb", "Gbb", "Ab", "Bbb"];
            expect(new Key("C", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["C#", "D", "E", "F", "Gb", "A", "Bb"];
            expect(new Key("C#", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["D", "Eb", "F", "Gb", "Abb", "Bb", "Cb"];
            expect(new Key("D", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["D#", "E", "F#", "G", "Ab", "B", "C"];
            expect(new Key("D#", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["E", "F", "G", "Ab", "Bbb", "C", "Db"];
            expect(new Key("E", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["F", "Gb", "Ab", "Bbb", "Cbb", "Db", "Ebb"];
            expect(new Key("F", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["F#", "G", "A", "Bb", "Cb", "D", "Eb"];
            expect(new Key("F#", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["G", "Ab", "Bb", "Cb", "Dbb", "Eb", "Fb"];
            expect(new Key("G", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["G#", "A", "B", "C", "Db", "E", "F"];
            expect(new Key("G#", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["A", "Bb", "C", "Db", "Ebb", "F", "Gb"];
            expect(new Key("A", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["A#", "B", "C#", "D", "Eb", "F#", "G"];
            expect(new Key("A#", Scale.GS).scaleNotes).to.have.ordered.members(expected);
            expected = ["B", "C", "D", "Eb", "Fb", "G", "Ab"];
            expect(new Key("B", Scale.GS).scaleNotes).to.have.ordered.members(expected);
        });
    });
})
