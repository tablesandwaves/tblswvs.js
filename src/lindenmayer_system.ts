type productionRule = {
    matchStr: string,
    output: string
}


export class LindenmayerSystem {
    axiom: string;
    string: string;
    productionRules: {[index: string]:string};


    constructor(axiom: string) {
        this.axiom = axiom;
        this.string = axiom;
        this.productionRules = {};
    }


    add(rule: productionRule): void {
        this.productionRules[rule.matchStr] = rule.output;
    }


    rules() {
        return Object.keys(this.productionRules);
    }


    advance() {
        this.string = this.string.split(" ").map(letter => {
            return letter in this.productionRules ? this.productionRules[letter] : letter;
        }).join(" ");
    }


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