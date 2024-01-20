const mongoose = require('mongoose');
const Match = require('../models/matchModel');
const Champion = require('../models/championModel');

const aliases = {
  '98a8790d-3018-5351-8b89-4e36441ff486': 'HubKur',
  'artur': 'Artur'
}

const getMatches = async (request, response) =>
{
  const season = request.query.season;
  const matches = await Match.find({season: season}).sort({createdAt: -1});

  for(const m in matches){
    const match = matches[m];

    for(const t in match.teams){
      const team = match.teams[t];

      for(const p in team.players){
        const player = team.players[p];
        
        if(aliases.hasOwnProperty(player.riotId)){
          player.summonerName = aliases[player.riotId];
        }
        
        console.log(player);
      }
    }

    break;
  }

  response.status(200).json(matches);
};

const getMatch = async (request, response) =>
{
  const {id} = request.params;

  if(!mongoose.Types.ObjectId.isValid(id))
  {
    return response.status(404).json({error: "Match not found. Invalid ID type"});
  }

  const match = await Match.findById(id);

  if (!match)
  {
    return response.status(404).json({error: "Match not found"});
  }

  response.status(200).json(match);
};

const addMatch = async (request, response) =>
{
  try
  {
    const username = request.get('Authorization').split(':')[0].trim();
    const password = request.get('Authorization').split(':')[1].trim();

    if (username != process.env.USER || password != process.env.PASSWORD)
    {
       return response.status(401).json({error: 'Unauthorized'});
    }

    let winningTeam = ''

    let teams = [];

    for(let teamId = 0; teamId < 2; teamId++)
    {
      const side = teamId == 0 ? 'Blue': 'Red';
      let bans = [];

      for(let banId = 0; banId < bans.length; banId++)
      {
        const champion = await Champion.findOne({key: request.body.teams[teamId].bans[banId].championId});
        bans.push(champion == null ? request.body.teams[teamId].bans[banId].championId : champion.name);
      }

      teams.push({
        side: side,
        bans: bans,
        players: []
      });
    }

    let roles = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];

    for(let i = 0; i < 10; i++)
    {
      let player = {};

      const participant = request.body.participants[i];
      const identity = request.body.participantIdentities[i];

      player.riotId = identity.player.puuid;
      player.summonerName = identity.player.summonerName;

      const champion = await Champion.findOne({key: participant.championId});
      player.champion = champion.name;

      player.kills = participant.stats.kills;
      player.deaths = participant.stats.deaths;
      player.assists = participant.stats.assists;
      player.gold = participant.stats.goldEarned;
      player.cs = participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled;
      player.damageDealt = participant.stats.totalDamageDealtToChampions;
      player.damageTaken = participant.stats.totalDamageTaken;
      player.damageTurrets = participant.stats.damageDealtToTurrets;
      player.visionScore = participant.stats.visionScore;

      if(i < 5)
      {
        player.role = roles[i];

        if(participant.stats.win)
        {
          winningTeam = 'Blue'
        }

        teams[0].players.push(player)
      }
      else
      {
        player.role = roles[i - 5];

        if(participant.stats.win)
        {
          winningTeam = 'Red'
        }

        teams[1].players.push(player)
      }
    }

    const match = await Match.create({
      season: 3,
      gameId: request.body.gameId,
      duration: request.body.gameDuration, 
      win: winningTeam,
      teams: teams,
      riotMatch: request.body
    });

    response.status(200).json(match);
  }
  catch(error)
  {
    response.status(400).json({error: error.message})
  }
};

const deleteMatch = async (request, response) =>
{
  const username = request.get('Authorization').split(':')[0].trim();
  const password = request.get('Authorization').split(':')[1].trim();

  if (username != process.env.USER || password != process.env.PASSWORD)
  {
    return response.status(401).json({error: 'Unauthorized'});
  }

  const {id} = request.params;

  if(!mongoose.Types.ObjectId.isValid(id))
  {
    return response.status(404).json({error: "Match not found. Invalid ID type"});
  }

  const match = await Match.findOneAndDelete({_id: id});

  if (!match)
  {
    return response.status(404).json({error: "Match not found"});
  }

  response.status(200).json(match);
};

const updateMatch = async (request, response) =>
{
  const username = request.get('Authorization').split(':')[0].trim();
  const password = request.get('Authorization').split(':')[1].trim();

  if (username != process.env.USER || password != process.env.PASSWORD)
  {
    return response.status(401).json({error: 'Unauthorized'});
  }

  const {id} = request.params;

  if(!mongoose.Types.ObjectId.isValid(id))
  {
    return response.status(404).json({error: "Match not found. Invalid ID type"});
  }

  const match = await Match.findOneAndUpdate({_id: id}, request.body);

  if (!match)
  {
    return response.status(404).json({error: "Match not found"});
  }

  response.status(200).json(match);
}

module.exports = {
  getMatches,
  getMatch,
  addMatch,
  deleteMatch,
  updateMatch
};