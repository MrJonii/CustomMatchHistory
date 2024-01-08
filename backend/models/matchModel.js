const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  riotId: {
    type: String,
    required: true
  },
  summonerName: {
    type: String,
    required: true
  },
  champion: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  kills: {
    type: Number,
    required: true
  },
  deaths: {
    type: Number,
    required: true
  },
  assists: {
    type: Number,
    required: true
  },
  gold: {
    type: Number,
    required: true
  },
  cs: {
    type: Number,
    required: true
  },
  damageDealt: {
    type: Number,
    required: true
  },
  damageTaken: {
    type: Number,
    required: true
  },
  damageTurrets: {
    type: Number,
    required: true
  },
  visionScore: {
    type: Number,
    required: true
  },
});

const teamSchema = new Schema({
  side: {
    type: String,
    required: true
  },
  bans: {
    type: [String],
    required: true
  },
  players: {
    type: [playerSchema],
    required: true
    },
});

const matchSchema = new Schema({
  gameId: {
    type: String,
    required: true
  },
  season: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  win: {
    type: String,
    required: true
  },
  teams: {
    type: [teamSchema],
    required: false
  },
  riotMatch: {
    type: Object,
    required: false
  }
},
{timestamps: true});

module.exports = mongoose.model('Match', matchSchema);