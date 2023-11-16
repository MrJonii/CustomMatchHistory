const express = require('express');
const {
  getMatches,
  getMatch,
  addMatch,
  deleteMatch,
  updateMatch
} = require('../controllers/matchesController');

const router = express.Router();

router.get('/', getMatches);
router.get('/:id', getMatch);
router.post('/', addMatch);
router.delete('/:id', deleteMatch);
router.patch('/:id', updateMatch);

module.exports = router;