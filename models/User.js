const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const findOrCreate = require('mongoose-find-or-create');


const UserSchema = new Schema({

  email: {
    type: String,
    required: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  }

});

// If user isn't already in the DB, creates a new account
UserSchema.static('findOneOrCreate', async function findOneOrCreate(condition, user) {
  const one = await this.findOne(condition);

  return one || this.create(user);
})


const User = mongoose.model("User", UserSchema);
module.exports = User;
