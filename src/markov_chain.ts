export class MarkovChain {
    input: any[];
    stateTransitionMatrix: Map<(string), (string|number)[]>;


    constructor(input: any[]) {
        this.input = input;
        this.stateTransitionMatrix = this.generateStm();
    }


    get(previous: number, current: number): (string|number) {
        const candidates = this.stateTransitionMatrix.get(`${previous}:${current}`) || [];
        return candidates[Math.floor(Math.random() * candidates.length)];
    }


    private generateStm(): Map<(string), (string|number)[]> {
        return this.input.reduce((stm, step, i, arr) => {
            if (i < arr.length - 1) {
                const prevStep = (i == 0) ? step : arr[i - 1];
                const nextStep = arr[i + 1];
                const key      = `${prevStep}:${step}`;
                const values   = stm.get(key) || new Array();
                values.push(nextStep);
                stm.set(key, values);
            }
            return stm;
        }, new Map<(string), (string|number)[]>);
    }
}
