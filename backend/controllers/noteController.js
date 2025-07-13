const Note = require('../models/Note');

// Create
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const note = await Note.create({ title, content, tags,userId: req.user._id });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Read All
// exports.getNotes = async (req, res) => {
//   try {
//     const { q, tags } = req.query;
//     let filter = {};

//     if (q) filter.$or = [
//       { title: { $regex: q, $options: 'i' } },
//       { content: { $regex: q, $options: 'i' } }
//     ];

//     if (tags) filter.tags = { $in: tags.split(',') };

//     const notes = await Note.find({ userId: req.user._id, ...filter });
//     res.json(notes);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };



exports.getNotes = async (req, res) => {
  try {
    const { q, tags } = req.query;
    const userId = req.user._id;

    let filter = { userId };

    // Search filter - searches across all note properties including tags
    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { content: new RegExp(q, 'i') },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Tag filter (for the tag buttons)
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      // Use $in for more flexible matching
      filter.tags = { $in: tagArray };
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Server error fetching notes' });
  }
};

// Read by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update
exports.updateNote = async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};




exports.toggleFavoriteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.favorite = !note.favorite;
    await note.save();

    res.json({ message: 'Favorite toggled', favorite: note.favorite });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

