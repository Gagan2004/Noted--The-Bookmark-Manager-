const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: String,
  description: String,
  tags: {
    type: [String],
    default: []
  },
  favorite: { type: Boolean, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);





