let mongoose = require("mongoose");
let Schema = mongoose.Schema;
// const findOrCreate = require('mongoose-find-or-create');


let UserSchema = new Schema({

  email: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  // `match` is an object that stores a Match id
  // The ref property links the ObjectId to the Match model
  // This allows us to populate the User with an associated Note
  match: [
      {
          type: Schema.Types.ObjectId,
          ref: "Match"
      }
  ]

});

// This creates our model from the above schema, using mongoose's model method
let User = mongoose.model("User", UserSchema);

// Export the Article model
module.exports = User;
