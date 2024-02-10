const express = require('express');

const {
  getPoll,
  postVote
} = require('../controllers/mvpController');

const router = express.Router();

router.get('/', getPoll);
router.post('/', postVote);

module.exports = router;