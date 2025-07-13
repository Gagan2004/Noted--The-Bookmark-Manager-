const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  toggleFavoriteNote
} = require('../controllers/noteController');

const protect = require('../middleware/authMiddleware');

router.use(protect);

router.patch('/:id/favorite', toggleFavoriteNote);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;









