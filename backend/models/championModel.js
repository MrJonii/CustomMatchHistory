const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const championSchema = new Schema({
  key: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
},
{timestamps: true});

module.exports = mongoose.model('Champion', championSchema);