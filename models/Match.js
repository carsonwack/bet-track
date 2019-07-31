let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let MatchSchema = new Schema({

  emails: { type: [String] },

  scores: { type: [String] },

  names: { type: [String] },

  propBets: [{
    propLabels: String,
    selected: String,
    userWon: String
  }]

});


let Match = mongoose.model("Match", MatchSchema);
module.exports = Match;