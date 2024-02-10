const mongoose = require('mongoose');
const Champion = require('../models/championModel');

const getChampions = async (request, response) =>
{
  const champions = await Champion.find({}).sort({createdAt: -1});
  response.status(200).json(champions);
};

const getChampion = async (request, response) =>
{
  const {id} = request.params;

  if(!mongoose.Types.ObjectId.isValid(id))
    {
    return response.status(404).json({error: "Champion not found. Invalid ID type"});
  }

  const champion = await Champion.findById(id);

  if (!champion)
  {
    return response.status(404).json({error: "Champion not found"});
  }

  response.status(200).json(champion);
};

const addChampion = async (request, response) =>
{
  try
  {
    const username = request.get('Authorization').split(':')[0].trim();
    const password = request.get('Authorization').split(':')[1].trim();
    
    if (username != process.env.USER || password != process.env.PASSWORD)
    {
      return response.status(401).json({error: 'Unauthorized'});
    }

    const champion = await Champion.create({
      key: request.body.key,
      name: request.body.name
    });

    response.status(200).json(champion);
  }
  catch(error)
  {
    response.status(400).json({error: error.message});
  }
};

const deleteChampion = async (request, response) =>
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
    return response.status(404).json({error: "Champion not found. Invalid ID type"});
  }

  const champion = await Champion.findOneAndDelete({_id: id});

  if (!champion)
  {
    return response.status(404).json({error: "Champion not found"});
  }

  response.status(200).json(champion);
};

const updateChampion = async (request, response) =>
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
    return response.status(404).json({error: "Champion not found. Invalid ID type"});
  }

  const champion = await Champion.findOneAndUpdate({_id: id}, ...request.body);

  if (!champion)
  {
    return response.status(404).json({error: "Champion not found"});
  }

  response.status(200).json(champion);
}

module.exports = {
  getChampions,
  getChampion,
  addChampion,
  deleteChampion,
  updateChampion
};