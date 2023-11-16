const express = require('express');
const {
  getChampions,
  getChampion,
  addChampion,
  deleteChampion,
  updateChampion
} = require('../controllers/championsController');

const router = express.Router();

router.get('/', getChampions);
router.get('/:id', getChampion);
router.post('/', addChampion);
router.delete('/:id', deleteChampion);
router.patch('/:id', updateChampion);

module.exports = router;