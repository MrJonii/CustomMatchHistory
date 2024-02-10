const mongoose = require('mongoose');
const {  } = require('matchesController');

let poll = {};

const startPoll = async (match) => {
  poll.match = match;
  poll.voters = {};
  setTimeout(concludePoll, 5 * 60 * 1000);
}

const concludePoll = async () => {
  let blue = [];
  let red = [];

  for(const v in poll.voters){
    const voter = poll.voters[v];

    const blueVote = blue.find(x => x.id === voter.blue);
    const redVote = red.find(x => x.id === voter.red);

    if(blueVote){
      blueVote.count++;
    }else{
      blue.push({id: voter.blue, count: 1});
    }

    if(redVote){
      redVote.count++;
    }else{
      red.push({id: voter.red, count: 1});
    }
  }

  const sortedBlue = blue.slice().sort((x, y) => y.count - x.count);
  const sortedRed = red.slice().sort((x, y) => y.count - x.count);

  let mvps = [];

  for(const p in sortedBlue){
    const player = sortedBlue[p];

    if(player.count == sortedBlue[0].count){
      mvps.push(player.id);
    }
  }

  for(const p in sortedRed){
    const player = sortedRed[p];

    if(player.count == sortedRed[0].count){
      mvps.push(player.id);
    }
  }

  for(const t in match.teams){
    for(const p in match.teams[t].players){
      const player = match.teams[t].players[p];
      if(mvps.includes(player.riotId)){
        player.mvp = true;
      }
    }
  }

  poll = {};
}

const getPoll = async (request, response) =>
{
  response.status(200).json(poll.match);
};

const postVote = async (request, response) =>
{
  try
  {
    if(poll.voters.hasOwnProperty(request.body.voter)){
        response.status(400).json({error: 'Already voted'});
    }

    poll.voters[request.body.voter] = { blue: request.body.blue, red: request.body.red };

    response.status(200).json(poll[request.body.voter]);
  }
  catch(error)
  {
    response.status(400).json({error: error.message});
  }
};

module.exports = {
  getPoll,
  postVote,
};