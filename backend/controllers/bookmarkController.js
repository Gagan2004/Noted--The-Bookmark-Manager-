const Bookmark = require('../models/Bookmark');
// const validator = require('validator');
const fetchTitleFromURL = require('../utils/fetchTitle');


// Create
exports.createBookmark = async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;

    // if (!url || !validator.isURL(url)) {
    if (!url ) {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    let finalTitle = title;

    if (!title || title.trim() === '') {
        finalTitle = await fetchTitleFromURL(url) || 'Untitled Bookmark';
      }
  


    const bookmark = await Bookmark.create({
      url,
      title: title || '',
      description,
      tags,
      userId: req.user._id
    });

    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Read All (with search & tag filtering)
// exports.getBookmarks = async (req, res) => {
//   try {
//     const { q, tags } = req.query;
//     let filter = {};

//     if (q) {
//       filter.$or = [
//         { title: { $regex: q, $options: 'i' } },
//         { description: { $regex: q, $options: 'i' } },
//         { url: { $regex: q, $options: 'i' } }
//       ];
//     }

//     if (tags) {
//       filter.tags = { $in: tags.split(',') };
//     }

//     const bookmarks = await Bookmark.find({ userId: req.user._id, ...filter });
//     res.json(bookmarks);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };





exports.getBookmarks = async (req, res) => {
  try {
    const { q, tags } = req.query;
    const userId = req.user._id;

    let filter = { userId };

    // Search filter - searches across all bookmark properties including tags
    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { url: new RegExp(q, 'i') },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Tag filter (for the tag buttons)
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      // Use $in instead of $all for more flexible matching
      filter.tags = { $in: tagArray };
    }

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    console.error('Error fetching bookmarks:', err); // Added logging
    res.status(500).json({ error: 'Server error fetching bookmarks' });
  }
};




// Read by ID
exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update
exports.updateBookmark = async (req, res) => {
  try {
    const updated = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete
exports.deleteBookmark = async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



exports.toggleFavoriteBookmark = async (req, res) => {
    try {
      const bookmark = await Bookmark.findById(req.params.id);
      if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
  
      bookmark.favorite = !bookmark.favorite;
      await bookmark.save();
  
      res.json({ message: 'Favorite toggled', favorite: bookmark.favorite });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  