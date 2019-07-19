let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let MatchSchema = new Schema({

  googleIds: {
    type: Array,
    required: true
  },

  scores: {
    type: Map,
    of: Number
  },

  propLabel: {
    type: Array
  }

});

// This creates our model from the above schema, using mongoose's model method
let Match = mongoose.model("Match", MatchSchema);

// Export the Article model
module.exports = Match;