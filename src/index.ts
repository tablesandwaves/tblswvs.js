// Note: using an import will still build, but Max's node processor cannot see the properties.
// Using require() instead.
const sequence = require("./sequence");
const melody   = require("./melody");
const vector   = require("./melodic_vector");


module.exports.MelodyType    = melody.MelodyType;
module.exports.Melody        = melody.Melody;
module.exports.MelodicVector = vector.MelodicVector;
