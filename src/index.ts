// Note: using an import will still build, but Max's node processor cannot see the properties.
// Using require() instead.
const sequence = require("./sequence");


module.exports.Sequence     = sequence.Sequence;
module.exports.SequenceMode = sequence.SequenceMode;
