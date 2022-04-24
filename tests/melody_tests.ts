import { expect } from "chai";
import { Melody, MelodyType } from "../src/melody";
import { TblswvsError } from "../src/tblswvs_error";
import { MusicalSymbol } from "../src/musical_symbol";
import * as helpers from "./test_helpers";


describe("Melody", () => {
    describe("when created", () => {
        it("has a default state", () => {
            const seq = new Melody();

            expect(seq.steps).to.be.an("array");
            expect(seq.restSymbol).to.be.a("number").that.equals(0);
            expect(seq.melodicMode).to.equal("Scale Degrees");
        });

        it("can be initialized with different parameters", () => {
            const notes = [60, 67, 69, 65].map(number => new MusicalSymbol(number));
            const mode = MelodyType.MIDI;

            expect(new Melody(notes).steps).to.be.an("array").that.has.ordered.members(notes);
            expect(new Melody(notes, "-").restSymbol).to.be.a("string").that.equals("-");
            expect(new Melody(notes, "-", mode).melodicMode).to.be.a("string").that.equals("MIDI");
        });
    });


    describe("when cloning from another one", () => {
        const source = new Melody([new MusicalSymbol(60)], "-", MelodyType.MIDI);
        const copy = source.clone();

        it("is not the same object", () => expect(copy).to.not.equal(source));
        it("looks like like the same melody", () => expect(copy).to.deep.equal(source));
        it("has the same steps", () => expect(copy.steps).to.equal(source.steps));
        it("has the same rest symbol", () => expect(copy.restSymbol).to.equal(source.restSymbol));
        it("has the same mode", () => expect(copy.melodicMode).to.equal(source.melodicMode));
    });


    describe("when created from multiple melodies", () => {
        const sources = [
            new Melody([new MusicalSymbol(60)], "-", MelodyType.MIDI),
            new Melody([new MusicalSymbol(67)], "-", MelodyType.MIDI)
        ];
        const copy = Melody.newFrom(sources);

        it("combines the steps", () => {
            let actual = copy.steps.map(step => step.value);
            expect(actual).to.have.ordered.members([60, 67])
        });
        it("has a rest symbol", () => expect(copy.restSymbol).to.equal("-"));
        it("has a mode", () => expect(copy.melodicMode).to.equal(MelodyType.MIDI));
    });


    describe("when attempting to combine incompatible Melodies", () => {

        it("cannot combine melodies with different rest symbols", () => {
            const sources = [
                new Melody([new MusicalSymbol(60)], 0, MelodyType.MIDI),
                new Melody([new MusicalSymbol(67)], "-", MelodyType.MIDI)
            ];
            expect(() => { return Melody.newFrom(sources) }).to.throw(TblswvsError, "same rest symbol and mode");
        });

        it("cannot combine melodies with different modes", () => {
            const sources = [
                new Melody([new MusicalSymbol(60)], "-", MelodyType.Degrees),
                new Melody([new MusicalSymbol(60)], "-", MelodyType.MIDI)
            ];
            expect(() => { return Melody.newFrom(sources) }).to.throw(TblswvsError, "same rest symbol and mode");
        })
    });


    describe("the self-similarity algorithms", () => {
        describe("self-replication", () => {
            const melody = new Melody(helpers.getMelodicSteps(["A", "G", "F", "E", "D"]));

            it("can generate self-similarity by ratios of N:1", () => {
                const expected = helpers.getFileContents("self-similarity.txt").trim().split(/\s+/);
                expect(melody.generateSelfSimilarMelody(63).values()).to.have.ordered.members(expected);
            });

            it("requires the input and output melody lengths to be coprime", () => {
                expect(() => { melody.generateSelfSimilarMelody(15) }).to.throw(TblswvsError, "A self-similar melody");
            });
        });
    });
});
