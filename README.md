# tblswvs.js

Utility for opinionated processing of musical data.

## About

This library provides a selection of musical algorithms for generative music. This project is currently (2023-02-11) under active development and therefore the best place to understand its API will be the [test suite](tests/).

### Example

Given the script:

```javascript
// self_similar_melody.js
import * as tblswvs from "tblswvs";

let melody = new tblswvs.Melody([60, 63, 65, 67, 68], -1, tblswvs.MelodyType.MIDI);

console.log("Self-similar Melody:");
console.log(melody.selfReplicate(63));
```

You should see the following output:

```bash
$ node self_similar_melody.js
Self-similar Melody:
Melody {
  steps: [
    60, 63, 63, 65, 63, 67, 65, 68, 63, 60, 67, 63,
    65, 65, 68, 67, 63, 67, 60, 65, 67, 68, 63, 60,
    65, 63, 65, 63, 68, 60, 67, 65, 63, 65, 67, 68,
    60, 63, 65, 67, 67, 65, 68, 60, 63, 63, 60, 65,
    65, 68, 63, 67, 65, 60, 63, 65, 68, 67, 60, 65,
    67, 65, 65
  ],
  restSymbol: -1,
  melodicMode: 'MIDI'
}
```

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
