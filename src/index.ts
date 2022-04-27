// Note: using an import will still build, but Max's node processor cannot see the properties.
// Using require() instead.
const melody   = require("./melody");
const vector   = require("./melodic_vector");
const rhythm   = require("./rhythm");


module.exports.MelodyType    = melody.MelodyType;
module.exports.Melody        = melody.Melody;
module.exports.MelodicVector = vector.MelodicVector;
module.exports.Rhythm        = rhythm.Rhythm;
