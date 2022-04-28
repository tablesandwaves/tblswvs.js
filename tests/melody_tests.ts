import { expect } from "chai";
import { Melody, MelodyType } from "../src/melody";
import { TblswvsError } from "../src/tblswvs_error";
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
            const notes = [60, 67, 69, 65];
            const mode = MelodyType.MIDI;

            expect(new Melody(notes).steps).to.be.an("array").that.has.ordered.members(notes);
            expect(new Melody(notes, "-").restSymbol).to.be.a("string").that.equals("-");
            expect(new Melody(notes, "-", mode).melodicMode).to.be.a("string").that.equals("MIDI");
        });
    });


    describe("when cloning from another one", () => {
        const source = new Melody([60], "-", MelodyType.MIDI);
        const copy = source.clone();

        it("is not the same object", () => expect(copy).to.not.equal(source));
        it("looks like like the same melody", () => expect(copy).to.deep.equal(source));
        it("has the same steps", () => expect(copy.steps).to.equal(source.steps));
        it("has the same rest symbol", () => expect(copy.restSymbol).to.equal(source.restSymbol));
        it("has the same mode", () => expect(copy.melodicMode).to.equal(source.melodicMode));
    });


    describe("when created from multiple melodies", () => {
        const sources = [
            new Melody([60], "-", MelodyType.MIDI),
            new Melody([67], "-", MelodyType.MIDI)
        ];
        const copy = Melody.newFrom(sources);

        it("combines the steps", () => {
            let actual = copy.steps;
            expect(actual).to.have.ordered.members([60, 67])
        });
        it("has a rest symbol", () => expect(copy.restSymbol).to.equal("-"));
        it("has a mode", () => expect(copy.melodicMode).to.equal(MelodyType.MIDI));
    });


    describe("when attempting to combine incompatible Melodies", () => {

        it("cannot combine melodies with different rest symbols", () => {
            const sources = [
                new Melody([60], 0, MelodyType.MIDI),
                new Melody([67], "-", MelodyType.MIDI)
            ];
            expect(() => { return Melody.newFrom(sources) }).to.throw(TblswvsError, "same rest symbol and mode");
        });

        it("cannot combine melodies with different modes", () => {
            const sources = [
                new Melody([60], "-", MelodyType.Degrees),
                new Melody([60], "-", MelodyType.MIDI)
            ];
            expect(() => { return Melody.newFrom(sources) }).to.throw(TblswvsError, "same rest symbol and mode");
        })
    });


    describe("the self-similarity algorithms", () => {
        describe("self-replication", () => {
            const melody = new Melody(["A", "G", "F", "E", "D"]);

            it("can generate self-similarity by ratios of 2^N:1", () => {
                const expected = helpers.getFileContents("self-replicating.txt").trim().split(/\s+/);
                const actual   = melody.selfReplicate(63).steps;
                expect(actual).to.have.ordered.members(expected);
                expect(helpers.isSelfReplicatingAt(actual, 2)).to.be.true;
            });

            it("can generate self-similarity by ratios that are not powers of 2", () => {
                const expected = helpers.getFileContents("self-replicating-by-3s.txt").trim().split(/\s+/);
                const actual   = melody.selfReplicate(16, 3).steps;
                expect(actual).to.have.ordered.members(expected);
                expect(helpers.isSelfReplicatingAt(actual, 3)).to.be.true;
            });

            it("requires the input and output melody lengths to be coprime", () => {
                expect(() => { melody.selfReplicate(16) }).to.throw(TblswvsError, "A self-similar melody");
            });
        });


        describe("counting music", () => {
            const melody = new Melody(["1", "2", "3", "4", "5", "6", "7"], "-");

            it("counts the steps by increasingly adjacent note sub-sequences", () => {
                const expected = helpers.getFileContents("counting-music.txt").trim().split(/\s+/);
                const actual   = melody.counted().steps;
                expect(actual).to.have.ordered.members(expected);
            })
        });


        describe("zig-zag", () => {
            it("works for an even number of steps", () => {
                const melody = new Melody(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]);
                const expected = helpers.getFileContents("zig-zag.txt").trim().split(/\s+/);
                const actual = melody.zigZag().steps;
                expect(actual).to.have.ordered.members(expected);
            });

            it("works for an odd number of steps", () => {
                const melody = new Melody(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]);
                const expected = helpers.getFileContents("zig-zag-odd.txt").trim().split(/\s+/);
                const actual = melody.zigZag().steps;
                expect(actual).to.have.ordered.members(expected);
            });
        });
    });


    describe("the infinity series", () => {
        const baseSequence  = [0, 1, -1, 2, 1, 0, -2, 3, -1, 2, 0, 1, 2, -1, -3, 4];
        const seqquence_0_3 = [0, 3, -3, 6, 3, 0, -6, 9, -3, 6, 0, 3, 6, -3, -9, 12];

        it("produces the base sequence when given no args", () => {
            expect(Melody.infinitySeries().steps).to.have.ordered.members(baseSequence);
        });

        it("can generate series with different seeds", () => {
            expect(Melody.infinitySeries([0, 3]).steps).to.have.ordered.members(seqquence_0_3);
        });

        it("can generate an arbitrary portion of the sequence", () => {
            const thru128       = Melody.infinitySeries([0, 1], 128).steps;
            const offset120for8 = Melody.infinitySeries([0, 1], 8, 120).steps;
            expect(offset120for8).to.have.ordered.members(thru128.slice(120, 128));
        });

        it("can generate an arbitrary portion for any seed", () => {
            expect(Melody.infinitySeries([0, 3], 4, 4).steps).to.have.ordered.members(seqquence_0_3.slice(4, 8));
        });
    });
});
