export class Sequence {
    steps: Array<number>;
    restSymbol?: string | number;
    mode = "scale_degrees";

    constructor() {
        this.steps = new Array();
    }
}
