type productionRule = {
    matchStr: string,
    output: string
}


/**
 * Lindenmayer Systems (or L-Systems) are string rewriting systems developed by, and named after, the Hungarian
 * biologist who used the algorithm to model the growth of plants and cell structures.
 *
 * This class represents a simple implementation of L-Systems where you can create one with a starting axiom,
 * add new "production rules," and generate new iterations of the L-System string. Additionally, this version
 * implements branching using the square bracket characters '[' and ']'. Branching enables an L-System string
 * to be translated into a 2-dimensional matrix.
 */
export class LindenmayerSystem {
    axiom: string;
    string: string;
    productionRules: {[index: string]:string};


    /**
     * Create a new LindenmayerSystem object.
     *
     * @param axiom the initial string for this L-System
     */
    constructor(axiom: string) {
        this.axiom = axiom;
        this.string = axiom;
        this.productionRules = {};
    }


    /**
     * Add a new production rule to the L-System.
     *
     * @param rule a string rewriting rule in the form of an object that has the properties "matchStr" and "output"
     */
    add(rule: productionRule): void {
        this.productionRules[rule.matchStr] = rule.output;
    }


    /**
     * Get the current list of production rule matching strings. To see the rewriting output for each rule,
     * access the productionRules property.
     *
     * @returns string[] the production rules matching strings
     */
    rules(): string[] {
        return Object.keys(this.productionRules);
    }


    /**
     * Advance the L-System by one generation.
     *
     * The current string, which is equal to the axiom until advanced,
     * will have its letters run thru the production rules. When a letter matches a production rule's "matchStr"
     * property, it will be replaced by the same production rule's "output" property in the resulting string.
     * When no match is found the current letter will simply be added without replacement.
     *
     * This will update the object's "string" property.
     */
    advance(): void {
        this.string = this.string.split(" ").map(letter => {
            return letter in this.productionRules ? this.productionRules[letter] : letter;
        }).join(" ");
    }


    /**
     * Get the current "string" as a matrix.
     *
     * A matrix representation is really only useful for L-System strings with branching characters so that
     * the matrix has multiple rows. The intention is to return a 2-D table-like representation of a branching
     * L-System string so that represents a polyphonic event sequence. The columns can be treated as sequencer
     * steps and the rows as simultaneous/polyphonic events for the current step/column.
     *
     * @returns string[][] a 2-dimensional matrix representation of the current L-System string
     */
    matrix(): string[][] {
        let matrix = new Array();
        matrix.push(new Array());
        let rowIndex = 0, colIndex = 0, branchCoordinates = [rowIndex, colIndex];

        this.string.split(" ").forEach((letter, i) => {
            if (letter == "[") {
                
                // When starting a new branch, note where the branch origin is for returning when the branch
                // ceases, increment the row count and create an Array for the new row.
                branchCoordinates = [rowIndex, colIndex];
                rowIndex = matrix.length;
                matrix.push(new Array());
                colIndex -= 1;

            } else if (letter == "]") {

                // When a branch terminates, return the cursor to the branching coordinates.
                rowIndex = branchCoordinates[0];
                colIndex = branchCoordinates[1];

            } else {

                // Add the current letter to the next position
                matrix[rowIndex][colIndex] = letter;
                colIndex += 1;
            }
        });

        return matrix;
    }
}