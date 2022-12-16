// Note: using an import will still build, but Max's node processor cannot see the properties.
// Using require() instead.
const melody  = require("./melody");
const harmony = require("./harmony");
const vector  = require("./melodic_vector");
const rhythm  = require("./rhythm");
const lsystem = require("./lindenmayer_system");
const markov  = require("./markov_chain");

module.exports.MelodyType        = melody.MelodyType;
module.exports.Melody            = melody.Melody;
module.exports.Mode              = harmony.Mode;
module.exports.Scale             = harmony.Scale;
module.exports.MelodicVector     = vector.MelodicVector;
module.exports.Rhythm            = rhythm.Rhythm;
module.exports.LindenmayerSystem = lsystem.LindenmayerSystem;
module.exports.MarkovChain       = markov.MarkovChain;
