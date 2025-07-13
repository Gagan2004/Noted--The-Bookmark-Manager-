const express = require('express');
const router = express.Router();
const {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  toggleFavoriteBookmark
} = require('../controllers/bookmarkController');

const protect = require('../middleware/authMiddleware');

router.use(protect);

router.patch('/:id/favorite', toggleFavoriteBookmark);
router.post('/', createBookmark);
router.get('/', getBookmarks);
router.get('/:id', getBookmarkById);
router.put('/:id', updateBookmark);
router.delete('/:id', deleteBookmark);

module.exports = router;
