require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const matchesApi = require('./api/matches');
const championsApi = require('./api/champions');

const app = express();

app.use(express.json());

app.get('/', (request, response) => {
  response.json({msg: "Hello World!"})
});

app.use('/api/matches', matchesApi);
app.use('/api/champions', championsApi);

mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
    app.listen(process.env.PORT, () => {
      console.log('Listening on port 42069!')
    })
  })
  .catch((error) => {
    console.error(error)
  });

