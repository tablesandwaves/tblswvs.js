import assert from "node:assert";
import { describe, it } from "node:test";
import { Key } from "../src/key";
import { Scale } from "../src/mode";
import { TblswvsError } from "../src/tblswvs_error";


describe("Key", () => {
  describe("when created with a MIDI note number tonic", () => {
    let aMinor = new Key(69, Scale.Minor);

    it("has a letter tonic", () => assert.equal(aMinor.tonic, "A"));
    it("has a MIDI note number tonic", () => assert.equal(aMinor.midiTonic, 9));
    it("has an octave based on the MIDI note", () => assert.equal(aMinor.octave, 3));
    it("has scale name", () => assert.equal(aMinor.scaleName, "Minor"));
    it("has a name", () => assert.equal(aMinor.name, "A Minor"));
  });


  describe("when created with a note letter tonic", () => {
    let dDorian = new Key("D", Scale.Dorian);

    it("knows its tonic as a letter", () => assert.equal(dDorian.tonic, "D"));
    it("knows its tonic as a MIDI note number", () => assert.equal(dDorian.midiTonic, 2));
    it("has the default octave 1", () => assert.equal(dDorian.octave, 1));
    it("has a scale name", () => assert.equal(dDorian.scaleName, "Dorian"));
    it("has a name", () => assert.equal(dDorian.name, "D Dorian"));
  });


  describe("when created with a scale name as a string", () => {
    let dDorian = new Key("D", Scale["Dorian"]);

    it("knows its tonic as a letter", () => assert.equal(dDorian.tonic, "D"));
    it("knows its tonic as a MIDI note number", () => assert.equal(dDorian.midiTonic, 2));
    it("has the default octave 1", () => assert.equal(dDorian.octave, 1));
    it("has a scale name", () => assert.equal(dDorian.scaleName, "Dorian"));
    it("has a name", () => assert.equal(dDorian.name, "D Dorian"));
  });


  describe("when getting a key's scale degrees", () => {
    let dDorian = new Key("D", Scale.Dorian);
    let cMinor  = new Key(60, Scale.Minor);

    it("returns an error for scale degree 0", () => {
      assert.throws(() => dDorian.degree(0), TblswvsError, "Scale degrees must be negative or positive, but not 0");
    });

    it("knows its scale degrees by numeric accessor", () => {
      assert.deepEqual(dDorian.degree(1), {octave: 1, note: "D", midi: 38, scaleDegree: 1});
      assert.deepEqual(dDorian.degree(2), {octave: 1, note: "E", midi: 40, scaleDegree: 2});
      assert.deepEqual(dDorian.degree(3), {octave: 1, note: "F", midi: 41, scaleDegree: 3});
      assert.deepEqual(dDorian.degree(4), {octave: 1, note: "G", midi: 43, scaleDegree: 4});
      assert.deepEqual(dDorian.degree(5), {octave: 1, note: "A", midi: 45, scaleDegree: 5});
      assert.deepEqual(dDorian.degree(6), {octave: 1, note: "B", midi: 47, scaleDegree: 6});
      assert.deepEqual(dDorian.degree(7), {octave: 2, note: "C", midi: 48, scaleDegree: 7});
    });

    it("replaces a generic sharp note with the scale flat", () => {
      assert.deepEqual(new Key("C", Scale.Minor).degree(3), {octave: 1, note: "Eb", midi: 39, scaleDegree: 3});
    });

    it("gets the next octave when the degree is higher than the scale's length", () => {
      assert.deepEqual(new Key("C", Scale.Major).degree(9), {octave: 2, note: "D", midi: 50, scaleDegree: 9});
      assert.deepEqual(new Key("E", Scale.MinPentatonic).degree(6), {octave: 2, note: "E", midi: 52, scaleDegree: 6});
    });

    it("can index scale degrees in reverse order when the degree is less than 0", () => {
      assert.deepEqual(dDorian.degree(-1), {octave: 1, note: "C", midi: 36, scaleDegree: -1});
      assert.deepEqual(dDorian.degree(-2), {octave: 0, note: "B", midi: 35, scaleDegree: -2});
      assert.deepEqual(dDorian.degree(-3), {octave: 0, note: "A", midi: 33, scaleDegree: -3});
      assert.deepEqual(dDorian.degree(-4), {octave: 0, note: "G", midi: 31, scaleDegree: -4});
      assert.deepEqual(dDorian.degree(-5), {octave: 0, note: "F", midi: 29, scaleDegree: -5});
      assert.deepEqual(dDorian.degree(-6), {octave: 0, note: "E", midi: 28, scaleDegree: -6});
      assert.deepEqual(dDorian.degree(-7), {octave: 0, note: "D", midi: 26, scaleDegree: -7});
      assert.deepEqual(dDorian.degree(-8), {octave: 0, note: "C", midi: 24, scaleDegree: -8});
      assert.deepEqual(dDorian.degree(-9), {octave: -1, note: "B", midi: 23, scaleDegree: -9});
    });

    it("replaces a generic sharp note with the scale flat for negative scale degrees", () => {
      assert.deepEqual(new Key("C", Scale.Minor).degree(-1), {octave: 0, note: "Bb", midi: 34, scaleDegree: -1});
      assert.deepEqual(new Key("C", Scale.Minor).degree(-9), {octave: -1, note: "Ab", midi: 20, scaleDegree: -9});
    });

    it("can be given an optional octave transposition", () => {
      assert.deepEqual(dDorian.degree(1, 1), {octave: 2, note: "D", midi: 50, scaleDegree: 1});
      assert.deepEqual(dDorian.degree(-1, 1), {octave: 2, note: "C", midi: 48, scaleDegree: -1});
    });

    it("can index negative scale degrees for scales with flatted note names", () => {
      assert.deepEqual(cMinor.degree(-1), {octave: 2, note: "Bb", midi: 58, scaleDegree: -1});
      assert.deepEqual(cMinor.degree(-2), {octave: 2, note: "Ab", midi: 56, scaleDegree: -2});
      assert.deepEqual(cMinor.degree(-3), {octave: 2, note: "G", midi: 55, scaleDegree: -3});
      assert.deepEqual(cMinor.degree(-4), {octave: 2, note: "F", midi: 53, scaleDegree: -4});
      assert.deepEqual(cMinor.degree(-5), {octave: 2, note: "Eb", midi: 51, scaleDegree: -5});
      assert.deepEqual(cMinor.degree(-6), {octave: 2, note: "D", midi: 50, scaleDegree: -6});
      assert.deepEqual(cMinor.degree(-7), {octave: 2, note: "C", midi: 48, scaleDegree: -7});
      assert.deepEqual(cMinor.degree(-8), {octave: 1, note: "Bb", midi: 46, scaleDegree: -8});
      assert.deepEqual(cMinor.degree(-9), {octave: 1, note: "Ab", midi: 44, scaleDegree: -9});
    });
  });


  describe("when generating inversions for scale degree intervals", () => {
    let cMinor  = new Key(60, Scale.Minor);

    it("finds the inversions within the root octave", () => {
      assert.deepEqual(cMinor.degreeInversion(1), {octave: 4, note: "C", midi: 72, scaleDegree: 8});
      assert.deepEqual(cMinor.degreeInversion(2), {octave: 3, note: "Bb", midi: 70, scaleDegree: 7});
      assert.deepEqual(cMinor.degreeInversion(3), {octave: 3, note: "Ab", midi: 68, scaleDegree: 6});
      assert.deepEqual(cMinor.degreeInversion(4), {octave: 3, note: "G", midi: 67, scaleDegree: 5});
      assert.deepEqual(cMinor.degreeInversion(5), {octave: 3, note: "F", midi: 65, scaleDegree: 4});
      assert.deepEqual(cMinor.degreeInversion(6), {octave: 3, note: "Eb", midi: 63, scaleDegree: 3});
      assert.deepEqual(cMinor.degreeInversion(7), {octave: 3, note: "D", midi: 62, scaleDegree: 2});
      assert.deepEqual(cMinor.degreeInversion(8), {octave: 3, note: "C", midi: 60, scaleDegree: 1});
    });

    it("has an inversion range of +/- one octave around the Key's root octave", () => {
      assert.deepEqual(cMinor.degreeInversion(-1), {octave: 4, note: "D", midi: 74, scaleDegree: 9});
      assert.deepEqual(cMinor.degreeInversion(9), {octave: 2, note: "Bb", midi: 58, scaleDegree: -1});
      assert.deepEqual(cMinor.degreeInversion(-7), {octave: 5, note: "C", midi: 84, scaleDegree: 15});
      assert.deepEqual(cMinor.degreeInversion(15), {octave: 2, note: "C", midi: 48, scaleDegree: -7});
    });

    it("clamps intervals outside of the +/- 1 octave range to range low/high and inverts them", () => {
      assert.deepEqual(cMinor.degreeInversion(-8), {octave: 5, note: "C", midi: 84, scaleDegree: 15});
      assert.deepEqual(cMinor.degreeInversion(-24), {octave: 5, note: "C", midi: 84, scaleDegree: 15});
      assert.deepEqual(cMinor.degreeInversion(16), {octave: 2, note: "C", midi: 48, scaleDegree: -7});
      assert.deepEqual(cMinor.degreeInversion(24), {octave: 2, note: "C", midi: 48, scaleDegree: -7});
    });
  });


  describe("when generating chords", () => {
    let cMajor    = new Key("C", Scale.Major);
    let cMinor    = new Key("C", Scale.Minor);
    let gDorian   = new Key(55, Scale.Dorian);
    let cSharpMinor = new Key(61, Scale.Minor);
    let dMinPent  = new Key(50, Scale.MinPentatonic);
    let cDiminished = new Key("C", Scale.Diminished);

    describe("requesting a chord for degree 0", () => {
      it("returns an error for scale degree 0", () => {
        assert.throws(() => cMinor.chord(0, "T"), TblswvsError, "Scale degrees must be negative or positive, but not 0");
      });
    });


    describe("in a diatonic scale, it finds", () => {
      it("octave", () => {
        assert.deepEqual(cMajor.chord(1, "oct"), {midi: [36, 48], quality: "oct", root: "C", degree: "1"});
      });

      it("power", () => {
        assert.deepEqual(cMajor.chord(2, "pow"), {midi: [38, 45], quality: "P5", root: "D", degree: "2"});
      });

      it("major triads", () => {
        assert.deepEqual(cMajor.chord(1, "T"), {midi: [36, 40, 43], quality: "M", root: "C", degree: "I"});
        assert.deepEqual(cMajor.chord(4, "T"), {midi: [41, 45, 48], quality: "M", root: "F", degree: "IV"});
        assert.deepEqual(cMajor.chord(5, "T"), {midi: [43, 47, 50], quality: "M", root: "G", degree: "V"});
      });

      it("minor triads", () => {
        assert.deepEqual(cMajor.chord(2, "T"), {midi: [38, 41, 45], quality: "m", root: "D", degree: "ii"});
        assert.deepEqual(cMajor.chord(3, "T"), {midi: [40, 43, 47], quality: "m", root: "E", degree: "iii"});
        assert.deepEqual(cMajor.chord(6, "T"), {midi: [45, 48, 52], quality: "m", root: "A", degree: "vi"});
      });

      it("diminished triad", () => {
        assert.deepEqual(cMajor.chord(7, "T"), {midi: [47, 50, 53], quality: "dim", root: "B", degree: "viio"});
      });

      it("roots that are flat", () => {
        assert.deepEqual(cMinor.chord(3, "T"), {midi: [39, 43, 46], quality: "M", root: "Eb", degree: "III"});
      });

      it("maps the chord roots correctly for non-C", () => {
        assert.deepEqual(gDorian.chord(1, "T"), {midi: [55, 58, 62], quality: "m", root: "G", degree: "i"});
        assert.deepEqual(gDorian.chord(2, "T"), {midi: [57, 60, 64], quality: "m", root: "A", degree: "ii"});
        assert.deepEqual(gDorian.chord(3, "T"), {midi: [58, 62, 65], quality: "M", root: "Bb", degree: "III"});
        assert.deepEqual(gDorian.chord(4, "T"), {midi: [60, 64, 67], quality: "M", root: "C", degree: "IV"});
        assert.deepEqual(gDorian.chord(5, "T"), {midi: [62, 65, 69], quality: "m", root: "D", degree: "v"});
        assert.deepEqual(gDorian.chord(6, "T"), {midi: [64, 67, 70], quality: "dim", root: "E", degree: "vio"});
        assert.deepEqual(gDorian.chord(7, "T"), {midi: [65, 69, 72], quality: "M", root: "F", degree: "VII"});
        assert.deepEqual(cSharpMinor.chord(1, "T"), {midi: [61, 64, 68], quality: "m", root: "C#", degree: "i"});
        assert.deepEqual(cSharpMinor.chord(2, "T"), {midi: [63, 66, 69], quality: "dim", root: "D#", degree: "iio"});
        assert.deepEqual(cSharpMinor.chord(3, "T"), {midi: [64, 68, 71], quality: "M", root: "E", degree: "III"});
        assert.deepEqual(cSharpMinor.chord(4, "T"), {midi: [66, 69, 73], quality: "m", root: "F#", degree: "iv"});
        assert.deepEqual(cSharpMinor.chord(5, "T"), {midi: [68, 71, 75], quality: "m", root: "G#", degree: "v"});
        assert.deepEqual(cSharpMinor.chord(6, "T"), {midi: [69, 73, 76], quality: "M", root: "A", degree: "VI"});
        assert.deepEqual(cSharpMinor.chord(7, "T"), {midi: [71, 75, 78], quality: "M", root: "B", degree: "VII"});
      });

      it("chords for scale degrees above the octave range map correctly", () => {
        assert.deepEqual(dMinPent.chord(10, "T"), {midi: [72, 77, 81], quality: "-", root: "C", degree: "5"});
        assert.deepEqual(cMinor.chord(8, "T"), {midi: [48, 51, 55], quality: "m", root: "C", degree: "i"});
        assert.deepEqual(cMinor.chord(9, "T"), {midi: [50, 53, 56], quality: "dim", root: "D", degree: "iio"});
      });
    });


    describe("in custom, non-heptatonic scales", () => {
      const cMajPent  = new Key("C", Scale.MajPentatonic);
      const cWT     = new Key("C", Scale.WholeTone);
      const cChromatic  = new Key("C", Scale.Chromatic);
      const cGS     = new Key("C", Scale.GS);

      it("finds a minor slash chord", () => {
        assert.deepEqual(cMajPent.chord(1, "T"), {midi: [36, 40, 45], quality: "-", root: "C", degree: "1"});
      });

      it("finds a sus2 slash chord", () => {
        assert.deepEqual(cMajPent.chord(2, "T"), {midi: [38, 43, 48], quality: "-", root: "D", degree: "2"});
        assert.deepEqual(cMajPent.chord(3, "T"), {midi: [40, 45, 50], quality: "-", root: "E", degree: "3"});
        assert.deepEqual(cMajPent.chord(5, "T"), {midi: [45, 50, 55], quality: "-", root: "A", degree: "5"});
      });

      it("finds a major slash chord", () => {
        assert.deepEqual(cMajPent.chord(4, "T"), {midi: [43, 48, 52], quality: "-", root: "G", degree: "4"});
      });

      it("finds an augmented chord", () => {
        assert.deepEqual(cWT.chord(1, "T"), {midi: [36, 40, 44], quality: "aug", root: "C", degree: "I+"});
        assert.deepEqual(cWT.chord(2, "T"), {midi: [38, 42, 46], quality: "aug", root: "D", degree: "II+"});
      });

      it("finds a whole tone chord", () => {
        assert.deepEqual(cChromatic.chord(1, "T"), {midi: [36, 38, 40], quality: "-", root: "C", degree: "1"});
        assert.deepEqual(cChromatic.chord(2, "T"), {midi: [37, 39, 41], quality: "-", root: "C#", degree: "2"});
      });

      it("finds a chord with a flatted degree", () => {
        assert.deepEqual(cGS.chord(1, "T"), {midi: [36, 39, 41], quality: "-", root: "C", degree: "1"});
        assert.deepEqual(cGS.chord(3, "T"), {midi: [39, 41, 45], quality: "-", root: "Eb", degree: "3"});
      });
    });


    describe("with transpositions", () => {
      it("can shift the chord to a higher octave", () => {
        assert.deepEqual(cMajor.chord(1, "T", 2), {midi: [60, 64, 67], quality: "M", root: "C", degree: "I"});
      });

      it("can shift the chord to a higher octave using a scale degree higher than the scale's degree count", () => {
        assert.deepEqual(cMajor.chord(8, "T"), {midi: [48, 52, 55], quality: "M", root: "C", degree: "I"});
      });

      it("can shift the chord to a lower octave", () => {
        assert.deepEqual(cMajor.chord(1, "T", -1), {midi: [24, 28, 31], quality: "M", root: "C", degree: "I"});
      });
    });


    describe("generating chords for negative scale degrees", () => {
      it("can use a negative scale degree index", () => {
        assert.deepEqual(cMinor.chord(-4, "T"), {midi: [29, 32, 36], quality: "m", root: "F", degree: "iv"});
      });

      it("can use a negative scale degree index beyond the first negative octave", () => {
        assert.deepEqual(cMinor.chord(-11, "T"), {midi: [17, 20, 24], quality: "m", root: "F", degree: "iv"});
      });

      it("finds a chord below the octave", () => {
        assert.deepEqual(cDiminished.chord(-1, "T"), {midi: [35, 38, 41], quality: "dim", root: "B", degree: "viiio"});
      });
    });


    describe("generating dyads", () => {
      describe("for a heptatonic scale", () => {
        let cMajor    = new Key("C", Scale.Major);
        let cMinor    = new Key("C", Scale.Minor);
        let gDorian   = new Key(55, Scale.Dorian);

        it("generates major scale 2-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad2"), {midi: [36, 38], quality: "M2", root: "C", degree: "I2"});
          assert.deepEqual(cMajor.chord(2, "dyad2"), {midi: [38, 40], quality: "M2", root: "D", degree: "II2"});
          assert.deepEqual(cMajor.chord(3, "dyad2"), {midi: [40, 41], quality: "m2", root: "E", degree: "iii2"});
          assert.deepEqual(cMajor.chord(4, "dyad2"), {midi: [41, 43], quality: "M2", root: "F", degree: "IV2"});
          assert.deepEqual(cMajor.chord(5, "dyad2"), {midi: [43, 45], quality: "M2", root: "G", degree: "V2"});
          assert.deepEqual(cMajor.chord(6, "dyad2"), {midi: [45, 47], quality: "M2", root: "A", degree: "VI2"});
          assert.deepEqual(cMajor.chord(7, "dyad2"), {midi: [47, 48], quality: "m2", root: "B", degree: "vii2"});
        });

        it("generates minor scale 2-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad2"), {midi: [36, 38], quality: "M2", root: "C", degree: "I2"});
          assert.deepEqual(cMinor.chord(2, "dyad2"), {midi: [38, 39], quality: "m2", root: "D", degree: "ii2"});
          assert.deepEqual(cMinor.chord(3, "dyad2"), {midi: [39, 41], quality: "M2", root: "Eb", degree: "III2"});
          assert.deepEqual(cMinor.chord(4, "dyad2"), {midi: [41, 43], quality: "M2", root: "F", degree: "IV2"});
          assert.deepEqual(cMinor.chord(5, "dyad2"), {midi: [43, 44], quality: "m2", root: "G", degree: "v2"});
          assert.deepEqual(cMinor.chord(6, "dyad2"), {midi: [44, 46], quality: "M2", root: "Ab", degree: "VI2"});
          assert.deepEqual(cMinor.chord(7, "dyad2"), {midi: [46, 48], quality: "M2", root: "Bb", degree: "VII2"});
        });

        it("generates major scale 3-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad3"), {midi: [36, 40], quality: "M3", root: "C", degree: "I3"});
          assert.deepEqual(cMajor.chord(2, "dyad3"), {midi: [38, 41], quality: "m3", root: "D", degree: "ii3"});
          assert.deepEqual(cMajor.chord(3, "dyad3"), {midi: [40, 43], quality: "m3", root: "E", degree: "iii3"});
          assert.deepEqual(cMajor.chord(4, "dyad3"), {midi: [41, 45], quality: "M3", root: "F", degree: "IV3"});
          assert.deepEqual(cMajor.chord(5, "dyad3"), {midi: [43, 47], quality: "M3", root: "G", degree: "V3"});
          assert.deepEqual(cMajor.chord(6, "dyad3"), {midi: [45, 48], quality: "m3", root: "A", degree: "vi3"});
          assert.deepEqual(cMajor.chord(7, "dyad3"), {midi: [47, 50], quality: "m3", root: "B", degree: "vii3"});
        });

        it("generates minor scale 3-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad3"), {midi: [36, 39], quality: "m3", root: "C",  degree: "i3"});
          assert.deepEqual(cMinor.chord(2, "dyad3"), {midi: [38, 41], quality: "m3", root: "D",  degree: "ii3"});
          assert.deepEqual(cMinor.chord(3, "dyad3"), {midi: [39, 43], quality: "M3", root: "Eb", degree: "III3"});
          assert.deepEqual(cMinor.chord(4, "dyad3"), {midi: [41, 44], quality: "m3", root: "F",  degree: "iv3"});
          assert.deepEqual(cMinor.chord(5, "dyad3"), {midi: [43, 46], quality: "m3", root: "G",  degree: "v3"});
          assert.deepEqual(cMinor.chord(6, "dyad3"), {midi: [44, 48], quality: "M3", root: "Ab", degree: "VI3"});
          assert.deepEqual(cMinor.chord(7, "dyad3"), {midi: [46, 50], quality: "M3", root: "Bb", degree: "VII3"});
        });

        it("generates major scale 4-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad4"), {midi: [36, 41], quality: "P4",   root: "C", degree: "1"});
          assert.deepEqual(cMajor.chord(2, "dyad4"), {midi: [38, 43], quality: "P4",   root: "D", degree: "2"});
          assert.deepEqual(cMajor.chord(3, "dyad4"), {midi: [40, 45], quality: "P4",   root: "E", degree: "3"});
          assert.deepEqual(cMajor.chord(4, "dyad4"), {midi: [41, 47], quality: "dim5", root: "F", degree: "iv5o"});
          assert.deepEqual(cMajor.chord(5, "dyad4"), {midi: [43, 48], quality: "P4",   root: "G", degree: "5"});
          assert.deepEqual(cMajor.chord(6, "dyad4"), {midi: [45, 50], quality: "P4",   root: "A", degree: "6"});
          assert.deepEqual(cMajor.chord(7, "dyad4"), {midi: [47, 52], quality: "P4",   root: "B", degree: "7"});
        });

        it("generates minor scale 4-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad4"), {midi: [36, 41], quality: "P4",   root: "C",  degree: "1"});
          assert.deepEqual(cMinor.chord(2, "dyad4"), {midi: [38, 43], quality: "P4",   root: "D",  degree: "2"});
          assert.deepEqual(cMinor.chord(3, "dyad4"), {midi: [39, 44], quality: "P4",   root: "Eb", degree: "3"});
          assert.deepEqual(cMinor.chord(4, "dyad4"), {midi: [41, 46], quality: "P4",   root: "F",  degree: "4"});
          assert.deepEqual(cMinor.chord(5, "dyad4"), {midi: [43, 48], quality: "P4",   root: "G",  degree: "5"});
          assert.deepEqual(cMinor.chord(6, "dyad4"), {midi: [44, 50], quality: "dim5", root: "Ab", degree: "vi5o"});
          assert.deepEqual(cMinor.chord(7, "dyad4"), {midi: [46, 51], quality: "P4",   root: "Bb", degree: "7"});
        });

        it("generates major scale 5-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad5"), {midi: [36, 43], quality: "P5",   root: "C", degree: "1"});
          assert.deepEqual(cMajor.chord(2, "dyad5"), {midi: [38, 45], quality: "P5",   root: "D", degree: "2"});
          assert.deepEqual(cMajor.chord(3, "dyad5"), {midi: [40, 47], quality: "P5",   root: "E", degree: "3"});
          assert.deepEqual(cMajor.chord(4, "dyad5"), {midi: [41, 48], quality: "P5",   root: "F", degree: "4"});
          assert.deepEqual(cMajor.chord(5, "dyad5"), {midi: [43, 50], quality: "P5",   root: "G", degree: "5"});
          assert.deepEqual(cMajor.chord(6, "dyad5"), {midi: [45, 52], quality: "P5",   root: "A", degree: "6"});
          assert.deepEqual(cMajor.chord(7, "dyad5"), {midi: [47, 53], quality: "dim5", root: "B", degree: "vii5o"});
        });

        it("generates minor scale 5-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad5"), {midi: [36, 43], quality: "P5",   root: "C",  degree: "1"});
          assert.deepEqual(cMinor.chord(2, "dyad5"), {midi: [38, 44], quality: "dim5", root: "D",  degree: "ii5o"});
          assert.deepEqual(cMinor.chord(3, "dyad5"), {midi: [39, 46], quality: "P5",   root: "Eb", degree: "3"});
          assert.deepEqual(cMinor.chord(4, "dyad5"), {midi: [41, 48], quality: "P5",   root: "F",  degree: "4"});
          assert.deepEqual(cMinor.chord(5, "dyad5"), {midi: [43, 50], quality: "P5",   root: "G",  degree: "5"});
          assert.deepEqual(cMinor.chord(6, "dyad5"), {midi: [44, 51], quality: "P5",   root: "Ab", degree: "6"});
          assert.deepEqual(cMinor.chord(7, "dyad5"), {midi: [46, 53], quality: "P5",   root: "Bb", degree: "7"});
        });

        it("generates major scale 6-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad6"), {midi: [36, 45], quality: "M6", root: "C", degree: "I6"});
          assert.deepEqual(cMajor.chord(2, "dyad6"), {midi: [38, 47], quality: "M6", root: "D", degree: "II6"});
          assert.deepEqual(cMajor.chord(3, "dyad6"), {midi: [40, 48], quality: "m6", root: "E", degree: "iii6"});
          assert.deepEqual(cMajor.chord(4, "dyad6"), {midi: [41, 50], quality: "M6", root: "F", degree: "IV6"});
          assert.deepEqual(cMajor.chord(5, "dyad6"), {midi: [43, 52], quality: "M6", root: "G", degree: "V6"});
          assert.deepEqual(cMajor.chord(6, "dyad6"), {midi: [45, 53], quality: "m6", root: "A", degree: "vi6"});
          assert.deepEqual(cMajor.chord(7, "dyad6"), {midi: [47, 55], quality: "m6", root: "B", degree: "vii6"});
        });

        it("generates minor scale 6-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad6"), {midi: [36, 44], quality: "m6", root: "C",  degree: "i6"});
          assert.deepEqual(cMinor.chord(2, "dyad6"), {midi: [38, 46], quality: "m6", root: "D",  degree: "ii6"});
          assert.deepEqual(cMinor.chord(3, "dyad6"), {midi: [39, 48], quality: "M6", root: "Eb", degree: "III6"});
          assert.deepEqual(cMinor.chord(4, "dyad6"), {midi: [41, 50], quality: "M6", root: "F",  degree: "IV6"});
          assert.deepEqual(cMinor.chord(5, "dyad6"), {midi: [43, 51], quality: "m6", root: "G",  degree: "v6"});
          assert.deepEqual(cMinor.chord(6, "dyad6"), {midi: [44, 53], quality: "M6", root: "Ab", degree: "VI6"});
          assert.deepEqual(cMinor.chord(7, "dyad6"), {midi: [46, 55], quality: "M6", root: "Bb", degree: "VII6"});
        });

        it("generates major scale 7-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad7"), {midi: [36, 47], quality: "M7", root: "C", degree: "I7"});
          assert.deepEqual(cMajor.chord(2, "dyad7"), {midi: [38, 48], quality: "m7", root: "D", degree: "ii7"});
          assert.deepEqual(cMajor.chord(3, "dyad7"), {midi: [40, 50], quality: "m7", root: "E", degree: "iii7"});
          assert.deepEqual(cMajor.chord(4, "dyad7"), {midi: [41, 52], quality: "M7", root: "F", degree: "IV7"});
          assert.deepEqual(cMajor.chord(5, "dyad7"), {midi: [43, 53], quality: "m7", root: "G", degree: "v7"});
          assert.deepEqual(cMajor.chord(6, "dyad7"), {midi: [45, 55], quality: "m7", root: "A", degree: "vi7"});
          assert.deepEqual(cMajor.chord(7, "dyad7"), {midi: [47, 57], quality: "m7", root: "B", degree: "vii7"});
        });

        it("generates minor scale 7-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad7"), {midi: [36, 46], quality: "m7", root: "C",  degree: "i7"});
          assert.deepEqual(cMinor.chord(2, "dyad7"), {midi: [38, 48], quality: "m7", root: "D",  degree: "ii7"});
          assert.deepEqual(cMinor.chord(3, "dyad7"), {midi: [39, 50], quality: "M7", root: "Eb", degree: "III7"});
          assert.deepEqual(cMinor.chord(4, "dyad7"), {midi: [41, 51], quality: "m7", root: "F",  degree: "iv7"});
          assert.deepEqual(cMinor.chord(5, "dyad7"), {midi: [43, 53], quality: "m7", root: "G",  degree: "v7"});
          assert.deepEqual(cMinor.chord(6, "dyad7"), {midi: [44, 55], quality: "M7", root: "Ab", degree: "VI7"});
          assert.deepEqual(cMinor.chord(7, "dyad7"), {midi: [46, 56], quality: "m7", root: "Bb", degree: "vii7"});
        });

        it("generates major scale 8-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad8"), {midi: [36, 48], quality: "oct", root: "C", degree: "1"});
          assert.deepEqual(cMajor.chord(2, "dyad8"), {midi: [38, 50], quality: "oct", root: "D", degree: "2"});
          assert.deepEqual(cMajor.chord(3, "dyad8"), {midi: [40, 52], quality: "oct", root: "E", degree: "3"});
          assert.deepEqual(cMajor.chord(4, "dyad8"), {midi: [41, 53], quality: "oct", root: "F", degree: "4"});
          assert.deepEqual(cMajor.chord(5, "dyad8"), {midi: [43, 55], quality: "oct", root: "G", degree: "5"});
          assert.deepEqual(cMajor.chord(6, "dyad8"), {midi: [45, 57], quality: "oct", root: "A", degree: "6"});
          assert.deepEqual(cMajor.chord(7, "dyad8"), {midi: [47, 59], quality: "oct", root: "B", degree: "7"});
        });

        it("generates minor scale 8-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad8"), {midi: [36, 48], quality: "oct", root: "C",  degree: "1"});
          assert.deepEqual(cMinor.chord(2, "dyad8"), {midi: [38, 50], quality: "oct", root: "D",  degree: "2"});
          assert.deepEqual(cMinor.chord(3, "dyad8"), {midi: [39, 51], quality: "oct", root: "Eb", degree: "3"});
          assert.deepEqual(cMinor.chord(4, "dyad8"), {midi: [41, 53], quality: "oct", root: "F",  degree: "4"});
          assert.deepEqual(cMinor.chord(5, "dyad8"), {midi: [43, 55], quality: "oct", root: "G",  degree: "5"});
          assert.deepEqual(cMinor.chord(6, "dyad8"), {midi: [44, 56], quality: "oct", root: "Ab", degree: "6"});
          assert.deepEqual(cMinor.chord(7, "dyad8"), {midi: [46, 58], quality: "oct", root: "Bb", degree: "7"});
        });

        it("generates major scale 9-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad9"), {midi: [36, 50], quality: "M9", root: "C", degree: "I9"});
          assert.deepEqual(cMajor.chord(2, "dyad9"), {midi: [38, 52], quality: "M9", root: "D", degree: "II9"});
          assert.deepEqual(cMajor.chord(3, "dyad9"), {midi: [40, 53], quality: "m9", root: "E", degree: "iii9"});
          assert.deepEqual(cMajor.chord(4, "dyad9"), {midi: [41, 55], quality: "M9", root: "F", degree: "IV9"});
          assert.deepEqual(cMajor.chord(5, "dyad9"), {midi: [43, 57], quality: "M9", root: "G", degree: "V9"});
          assert.deepEqual(cMajor.chord(6, "dyad9"), {midi: [45, 59], quality: "M9", root: "A", degree: "VI9"});
          assert.deepEqual(cMajor.chord(7, "dyad9"), {midi: [47, 60], quality: "m9", root: "B", degree: "vii9"});
        });

        it("generates minor scale 9-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad9"), {midi: [36, 50], quality: "M9", root: "C",  degree: "I9"});
          assert.deepEqual(cMinor.chord(2, "dyad9"), {midi: [38, 51], quality: "m9", root: "D",  degree: "ii9"});
          assert.deepEqual(cMinor.chord(3, "dyad9"), {midi: [39, 53], quality: "M9", root: "Eb", degree: "III9"});
          assert.deepEqual(cMinor.chord(4, "dyad9"), {midi: [41, 55], quality: "M9", root: "F",  degree: "IV9"});
          assert.deepEqual(cMinor.chord(5, "dyad9"), {midi: [43, 56], quality: "m9", root: "G",  degree: "v9"});
          assert.deepEqual(cMinor.chord(6, "dyad9"), {midi: [44, 58], quality: "M9", root: "Ab", degree: "VI9"});
          assert.deepEqual(cMinor.chord(7, "dyad9"), {midi: [46, 60], quality: "M9", root: "Bb", degree: "VII9"});
        });

        it("generates major scale 10-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad10"), {midi: [36, 52], quality: "M10", root: "C", degree: "I10"});
          assert.deepEqual(cMajor.chord(2, "dyad10"), {midi: [38, 53], quality: "m10", root: "D", degree: "ii10"});
          assert.deepEqual(cMajor.chord(3, "dyad10"), {midi: [40, 55], quality: "m10", root: "E", degree: "iii10"});
          assert.deepEqual(cMajor.chord(4, "dyad10"), {midi: [41, 57], quality: "M10", root: "F", degree: "IV10"});
          assert.deepEqual(cMajor.chord(5, "dyad10"), {midi: [43, 59], quality: "M10", root: "G", degree: "V10"});
          assert.deepEqual(cMajor.chord(6, "dyad10"), {midi: [45, 60], quality: "m10", root: "A", degree: "vi10"});
          assert.deepEqual(cMajor.chord(7, "dyad10"), {midi: [47, 62], quality: "m10", root: "B", degree: "vii10"});
        });

        it("generates minor scale 10-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad10"), {midi: [36, 51], quality: "m10", root: "C",  degree: "i10"});
          assert.deepEqual(cMinor.chord(2, "dyad10"), {midi: [38, 53], quality: "m10", root: "D",  degree: "ii10"});
          assert.deepEqual(cMinor.chord(3, "dyad10"), {midi: [39, 55], quality: "M10", root: "Eb", degree: "III10"});
          assert.deepEqual(cMinor.chord(4, "dyad10"), {midi: [41, 56], quality: "m10", root: "F",  degree: "iv10"});
          assert.deepEqual(cMinor.chord(5, "dyad10"), {midi: [43, 58], quality: "m10", root: "G",  degree: "v10"});
          assert.deepEqual(cMinor.chord(6, "dyad10"), {midi: [44, 60], quality: "M10", root: "Ab", degree: "VI10"});
          assert.deepEqual(cMinor.chord(7, "dyad10"), {midi: [46, 62], quality: "M10", root: "Bb", degree: "VII10"});
        });

        it("generates major scale 11-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad11"), {midi: [36, 53], quality: "m11", root: "C", degree: "i11"});
          assert.deepEqual(cMajor.chord(2, "dyad11"), {midi: [38, 55], quality: "m11", root: "D", degree: "ii11"});
          assert.deepEqual(cMajor.chord(3, "dyad11"), {midi: [40, 57], quality: "m11", root: "E", degree: "iii11"});
          assert.deepEqual(cMajor.chord(4, "dyad11"), {midi: [41, 59], quality: "M11", root: "F", degree: "IV11"});
          assert.deepEqual(cMajor.chord(5, "dyad11"), {midi: [43, 60], quality: "m11", root: "G", degree: "v11"});
          assert.deepEqual(cMajor.chord(6, "dyad11"), {midi: [45, 62], quality: "m11", root: "A", degree: "vi11"});
          assert.deepEqual(cMajor.chord(7, "dyad11"), {midi: [47, 64], quality: "m11", root: "B", degree: "vii11"});
        });

        it("generates minor scale 11-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad11"), {midi: [36, 53], quality: "m11", root: "C",  degree: "i11"});
          assert.deepEqual(cMinor.chord(2, "dyad11"), {midi: [38, 55], quality: "m11", root: "D",  degree: "ii11"});
          assert.deepEqual(cMinor.chord(3, "dyad11"), {midi: [39, 56], quality: "m11", root: "Eb", degree: "iii11"});
          assert.deepEqual(cMinor.chord(4, "dyad11"), {midi: [41, 58], quality: "m11", root: "F",  degree: "iv11"});
          assert.deepEqual(cMinor.chord(5, "dyad11"), {midi: [43, 60], quality: "m11", root: "G",  degree: "v11"});
          assert.deepEqual(cMinor.chord(6, "dyad11"), {midi: [44, 62], quality: "M11", root: "Ab", degree: "VI11"});
          assert.deepEqual(cMinor.chord(7, "dyad11"), {midi: [46, 63], quality: "m11", root: "Bb", degree: "vii11"});
        });

        it("generates major scale 12-dyads", () => {
          assert.deepEqual(cMajor.chord(1, "dyad12"), {midi: [36, 55], quality: "m12", root: "C", degree: "i12"});
          assert.deepEqual(cMajor.chord(2, "dyad12"), {midi: [38, 57], quality: "m12", root: "D", degree: "ii12"});
          assert.deepEqual(cMajor.chord(3, "dyad12"), {midi: [40, 59], quality: "m12", root: "E", degree: "iii12"});
          assert.deepEqual(cMajor.chord(4, "dyad12"), {midi: [41, 60], quality: "m12", root: "F", degree: "iv12"});
          assert.deepEqual(cMajor.chord(5, "dyad12"), {midi: [43, 62], quality: "m12", root: "G", degree: "v12"});
          assert.deepEqual(cMajor.chord(6, "dyad12"), {midi: [45, 64], quality: "m12", root: "A", degree: "vi12"});
          assert.deepEqual(cMajor.chord(7, "dyad12"), {midi: [47, 65], quality: "M11", root: "B", degree: "VII11"});
        });

        it("generates minor scale 12-dyads", () => {
          assert.deepEqual(cMinor.chord(1, "dyad12"), {midi: [36, 55], quality: "m12", root: "C",  degree: "i12"});
          assert.deepEqual(cMinor.chord(2, "dyad12"), {midi: [38, 56], quality: "M11", root: "D",  degree: "II11"});
          assert.deepEqual(cMinor.chord(3, "dyad12"), {midi: [39, 58], quality: "m12", root: "Eb", degree: "iii12"});
          assert.deepEqual(cMinor.chord(4, "dyad12"), {midi: [41, 60], quality: "m12", root: "F",  degree: "iv12"});
          assert.deepEqual(cMinor.chord(5, "dyad12"), {midi: [43, 62], quality: "m12", root: "G",  degree: "v12"});
          assert.deepEqual(cMinor.chord(6, "dyad12"), {midi: [44, 63], quality: "m12", root: "Ab", degree: "vi12"});
          assert.deepEqual(cMinor.chord(7, "dyad12"), {midi: [46, 65], quality: "m12", root: "Bb", degree: "vii12"});
        });
      });
    });
  });


  describe("when translating MIDI notes to scale notes", () => {
    const cMinor = new Key("C", Scale.Minor);

    it("returns the scale notes", () => {
      assert.equal(cMinor.midi2note(36), "C1");
      assert.equal(cMinor.midi2note(38), "D1");
      assert.equal(cMinor.midi2note(39), "Eb1");
      assert.equal(cMinor.midi2note(41), "F1");
      assert.equal(cMinor.midi2note(43), "G1");
      assert.equal(cMinor.midi2note(44), "Ab1");
      assert.equal(cMinor.midi2note(46), "Bb1");
    });

    it("returns a sharp accidental for a sharp/flat note in the scale", () => {
      assert.equal(cMinor.midi2note(37), "C#1");
      assert.equal(cMinor.midi2note(42), "F#1");
    });

    it("returns a natural accidental for a natural note in the scale", () => {
      assert.equal(cMinor.midi2note(40), "E♮1");
      assert.equal(cMinor.midi2note(45), "A♮1");
      assert.equal(cMinor.midi2note(47), "B♮1");
    });

    it("returns a note from another octave", () => {
      assert.equal(cMinor.midi2note(55), "G2");
      assert.equal(cMinor.midi2note(27), "Eb0");
      assert.equal(cMinor.midi2note(1), "C#-2");
      assert.equal(cMinor.midi2note(28), "E♮0");
    });

    it("returns a natural in a scale with three half step intervals", () => {
      const gs = new Key(50, Scale.GS);
      assert.equal(gs.midi2note(60), "C♮3");
    });
  });


  describe("can have scale notes", () => {
    it("with no sharps/flats", () => {
      assert.deepEqual(new Key("C", Scale.Major).scaleNotes, ["C", "D", "E", "F", "G", "A", "B"]);
      assert.deepEqual(new Key("A", Scale.Minor).scaleNotes, ["A", "B", "C", "D", "E", "F", "G"]);
    });

    it("with a sharp", () => {
      assert.deepEqual(new Key("G", Scale.Major).scaleNotes, ["G", "A", "B", "C", "D", "E", "F#"]);
    });

    it("with flats", () => {
      assert.deepEqual(new Key("C", Scale.Minor).scaleNotes, ["C", "D", "Eb", "F", "G", "Ab", "Bb"]);
    });

    it("with double sharps", () => {
      assert.deepEqual(new Key("G#", Scale.Major).scaleNotes, ["G#", "A#", "B#", "C#", "D#", "E#", "Fx"]);
    });

    it("for pentatonics (diatonic skips)", () => {
      assert.deepEqual(new Key("F#", Scale.MajPentatonic).scaleNotes, ["F#", "G#", "A#", "C#", "D#"]);
      assert.deepEqual(new Key("E", Scale.MinPentatonic).scaleNotes, ["E", "G", "A", "B", "D"]);
    });

    it("for Whole Tone", () => {
      assert.deepEqual(new Key("C", Scale.WholeTone).scaleNotes, ["C", "D", "E", "F#", "G#", "A#"]);
    });

    it("for Diminished", () => {
      assert.deepEqual(new Key("C", Scale.Diminished).scaleNotes, ["C", "D", "Eb", "F", "Gb", "G#", "A", "B"]);
    });

    it("for Chromatic", () => {
      const expected = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      assert.deepEqual(new Key("C", Scale.Chromatic).scaleNotes, expected);
    });

    it("for GS", () => {
      let expected;
      expected = ["C", "Db", "Eb", "Fb", "Gbb", "Ab", "Bbb"];
      assert.deepEqual(new Key("C", Scale.GS).scaleNotes, expected);
      expected = ["C#", "D", "E", "F", "Gb", "A", "Bb"];
      assert.deepEqual(new Key("C#", Scale.GS).scaleNotes, expected);
      expected = ["D", "Eb", "F", "Gb", "Abb", "Bb", "Cb"];
      assert.deepEqual(new Key("D", Scale.GS).scaleNotes, expected);
      expected = ["D#", "E", "F#", "G", "Ab", "B", "C"];
      assert.deepEqual(new Key("D#", Scale.GS).scaleNotes, expected);
      expected = ["E", "F", "G", "Ab", "Bbb", "C", "Db"];
      assert.deepEqual(new Key("E", Scale.GS).scaleNotes, expected);
      expected = ["F", "Gb", "Ab", "Bbb", "Cbb", "Db", "Ebb"];
      assert.deepEqual(new Key("F", Scale.GS).scaleNotes, expected);
      expected = ["F#", "G", "A", "Bb", "Cb", "D", "Eb"];
      assert.deepEqual(new Key("F#", Scale.GS).scaleNotes, expected);
      expected = ["G", "Ab", "Bb", "Cb", "Dbb", "Eb", "Fb"];
      assert.deepEqual(new Key("G", Scale.GS).scaleNotes, expected);
      expected = ["G#", "A", "B", "C", "Db", "E", "F"];
      assert.deepEqual(new Key("G#", Scale.GS).scaleNotes, expected);
      expected = ["A", "Bb", "C", "Db", "Ebb", "F", "Gb"];
      assert.deepEqual(new Key("A", Scale.GS).scaleNotes, expected);
      expected = ["A#", "B", "C#", "D", "Eb", "F#", "G"];
      assert.deepEqual(new Key("A#", Scale.GS).scaleNotes, expected);
      expected = ["B", "C", "D", "Eb", "Fb", "G", "Ab"];
      assert.deepEqual(new Key("B", Scale.GS).scaleNotes, expected);
    });
  });
});
