import { expect } from "chai";
import { Key } from "../src/key";
import { Scale } from "../src/mode";
import { Melody } from "../src/melody";
import { TblswvsError } from "../src/tblswvs_error";
import * as helpers from "./test_helpers";
import { chromaticScale, noteData } from "../src/note_data";


describe("Melody", () => {
    describe("when created", () => {
        const key = new Key("C", Scale.Minor);
        it("has a default state", () => {
            const seq = new Melody([], key);

            expect(seq.notes).to.be.an("array");
        });

        it("can be initialized with different parameters", () => {
            const notes = [60, 67, 69, 65].map(midiNum => {return {...noteData[midiNum]}});
            expect(new Melody(notes).notes).to.be.an("array").that.has.ordered.members(notes);
        });

        it("sets scale degrees for notes when a Key is supplied", () => {
            const notes = [60, 67, 69, 65].map(midiNum => {return {...noteData[midiNum]}});
            const melody = new Melody(notes, key);
            const expected = [1, 5, undefined, 4];
            expect(melody.notes.map(n => n.scaleDegree)).to.be.an("array").that.has.ordered.members(expected);
        });

        it("does not override scale degrees for notes when a Key is supplied", () => {
            const notes = [{ octave: 4, note: 'C', midi: 72, scaleDegree: 8 }];
            const melody = new Melody(notes, key);
            const expected = [8];
            expect(melody.notes.map(n => n.scaleDegree)).to.be.an("array").that.has.ordered.members(expected);
        });
    });


    describe("when cloning from another one", () => {
        const source = new Melody([{...noteData[60]}]);
        const copy = source.clone();

        it("is not the same object", () => expect(copy).to.not.equal(source));
        it("looks like like the same melody", () => expect(copy).to.deep.equal(source));
        it("has the same steps", () => expect(copy.notes).to.deep.equal(source.notes));
    });


    describe("when created from multiple melodies", () => {
        const sources = [
            new Melody([{...noteData[60]}]),
            new Melody([{...noteData[67]}])
        ];
        const copy = Melody.newFrom(sources);

        it("combines the steps", () => {
            let actual = copy.notes.map(n => n.midi);
            expect(actual).to.have.ordered.members([60, 67])
        });
    });


    describe("the self-similarity algorithms", () => {
        describe("self-replication", () => {
            const notes = ["A", "G", "F", "E", "D"].map(note => {return {...noteData[chromaticScale.findIndex(scaleNote => scaleNote == note)]}});
            const melody = new Melody(notes);

            it("can generate self-similarity by ratios of 2^N:1", () => {
                const expected = helpers.getFileContents("self-replicating.txt").trim().split(/\s+/);
                const actual   = melody.selfReplicate(63).notes.map(n => n.note);
                expect(actual).to.have.ordered.members(expected);
                expect(helpers.isSelfReplicatingAt(actual, 2)).to.be.true;
            });

            it("can generate self-similarity by ratios that are not powers of 2", () => {
                const expected = helpers.getFileContents("self-replicating-by-3s.txt").trim().split(/\s+/);
                const actual   = melody.selfReplicate(16, 3).notes.map(n => n.note);
                expect(actual).to.have.ordered.members(expected);
                expect(helpers.isSelfReplicatingAt(actual, 3)).to.be.true;
            });

            it("requires the input and output melody lengths to be coprime", () => {
                expect(() => { melody.selfReplicate(16) }).to.throw(TblswvsError, "A self-similar melody");
            });
        });


        describe("counting music", () => {
            const notes = [1, 2, 3, 4, 5, 6, 7].map(n => {return {...noteData[n]}});
            const melody = new Melody(notes);

            it("counts the steps by increasingly adjacent note sub-sequences", () => {
                const expected = helpers.fileContentsAsMidiNumbers("counting-music.txt");
                const actual   = melody.counted().notes.map(n => n.midi);
                expect(actual).to.have.ordered.members(expected);
            })
        });


        describe("zig-zag", () => {
            it("works for an even number of steps", () => {
                const notes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => {return {...noteData[n]}});
                const melody = new Melody(notes);

                const expected = helpers.fileContentsAsMidiNumbers("zig-zag.txt");
                const actual = melody.zigZag().notes.map(n => n.midi);
                expect(actual).to.have.ordered.members(expected);
            });

            it("works for an odd number of steps", () => {
                const notes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => {return {...noteData[n]}});
                const melody = new Melody(notes);
                const expected = helpers.fileContentsAsMidiNumbers("zig-zag-odd.txt");
                const actual = melody.zigZag().notes.map(n => n.midi);
                expect(actual).to.have.ordered.members(expected);
            });
        });
    });


    describe("the infinity series", () => {
        const baseSequence  = [0, 1, -1, 2, 1, 0, -2, 3, -1, 2, 0, 1, 2, -1, -3, 4];
        const seqquence_0_3 = [0, 3, -3, 6, 3, 0, -6, 9, -3, 6, 0, 3, 6, -3, -9, 12];

        it("produces the base sequence when given no args", () => {
            expect(Melody.infinitySeries()).to.have.ordered.members(baseSequence);
        });

        it("can generate series with different seeds", () => {
            expect(Melody.infinitySeries([0, 3])).to.have.ordered.members(seqquence_0_3);
        });

        it("can generate an arbitrary portion of the sequence", () => {
            const thru128       = Melody.infinitySeries([0, 1], 128);
            const offset120for8 = Melody.infinitySeries([0, 1], 8, 120);
            expect(offset120for8).to.have.ordered.members(thru128.slice(120, 128));
        });

        it("can generate an arbitrary portion for any seed", () => {
            expect(Melody.infinitySeries([0, 3], 4, 4)).to.have.ordered.members(seqquence_0_3.slice(4, 8));
        });
    });
});
