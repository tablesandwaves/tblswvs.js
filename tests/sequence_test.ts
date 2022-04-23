import { Sequence, SequenceMode } from "../src/sequence";
import { expect } from "chai";
import { TblswvsError } from "../src/tblswvs_error";

describe("Sequence", () => {
    it("has a default state", () => {
        const seq = new Sequence();

        expect(seq.steps).to.be.an("array");
        expect(seq.restSymbol).to.be.a("number").that.equals(0);
        expect(seq.mode).to.equal("Scale Degrees");
    });

    it("can be initialized with different parameters", () => {
        const notes = [60, 67, 69, 65];
        const mode  = SequenceMode.MIDI;

        expect(new Sequence(notes).steps).to.be.an("array").that.has.ordered.members(notes);
        expect(new Sequence(notes, "-").restSymbol).to.be.a("string").that.equals("-");
        expect(new Sequence(notes, "-", mode).mode).to.be.a("string").that.equals("MIDI");
    });
});


describe("a Sequence cloned from another one", () => {
    const source = new Sequence([60], "-", SequenceMode.MIDI);
    const copy = source.clone();

    it("is not the same sequence", () => expect(copy).to.not.equal(source));
    it("looks like like the same sequence", () => expect(copy).to.deep.equal(source));
    it("has the same steps", () => expect(copy.steps).to.equal(source.steps));
    it("has the same rest symbol", () => expect(copy.restSymbol).to.equal(source.restSymbol));
    it("has the same mode", () => expect(copy.mode).to.equal(source.mode));
});


describe("a Sequence created from multiple sequences", () => {
    const sources = [
        new Sequence([60], "-", SequenceMode.MIDI),
        new Sequence([67], "-", SequenceMode.MIDI)
    ];
    const copy = Sequence.newFrom(sources);

    it("combines the steps", () => expect(copy.steps).to.have.ordered.members([60, 67]));
    it("has a rest symbol", () => expect(copy.restSymbol).to.equal("-"));
    it("has a mode", () => expect(copy.mode).to.equal(SequenceMode.MIDI));
});


describe("when attempting to combine incompatible Sequences", () => {

    it("cannot combined sequences with different rest symbols", () => {
        const sources = [new Sequence([60], 0, SequenceMode.MIDI), new Sequence([67], "-", SequenceMode.MIDI)];
        expect(() => { return Sequence.newFrom(sources) }).to.throw(TblswvsError, "same rest symbol and mode");
    });

    it("cannot combined sequences with different modes", () => {
        const sources = [new Sequence([60], "-", SequenceMode.Degrees), new Sequence([67], "-", SequenceMode.MIDI)];
        expect(() => { return Sequence.newFrom(sources) }).to.throw(TblswvsError, "same rest symbol and mode");
    })
});
