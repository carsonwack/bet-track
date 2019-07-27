let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let MatchSchema = new Schema({

  emails: { type: [String] },

  scores: { type: [String] },

  propLabels: { type: [String] }

});


let Match = mongoose.model("Match", MatchSchema);
module.exports = Match;