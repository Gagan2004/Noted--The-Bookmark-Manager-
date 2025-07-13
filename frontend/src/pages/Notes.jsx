

import { useEffect, useState } from 'react';
import axios from 'axios';
import NoteCard from '../components/NoteCard';
import debounce from 'lodash.debounce';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
    
  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (search.trim()) {
        params.append('q', search.trim());
      }
      
      if (selectedTags.length > 0) {
        const validTags = selectedTags
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        
        if (validTags.length > 0) {
          params.append('tags', validTags.join(','));
        }
      }

      const res = await axios.get(`https://noted-the-bookmark-manager.onrender.com/api/notes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotes(res.data);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await axios.post('https://noted-the-bookmark-manager.onrender.com/api/notes', {
        ...form,
        tags: form.tags.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ title: '', content: '', tags: '' });
      fetchNotes();
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note');
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`https://noted-the-bookmark-manager.onrender.com/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    }
  };

  const toggleFavorite = async id => {
    try {
      await axios.patch(`https://noted-the-bookmark-manager.onrender.com/api/notes/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update note');
    }
  };

  useEffect(() => {
    const debounced = debounce(() => fetchNotes(), 300);
    debounced();
    return () => debounced.cancel();
  }, [search, selectedTags]);

  // Auto-collapse form when searching/filtering
  useEffect(() => {
    if (search.trim() || selectedTags.length > 0) {
      setShowCreateForm(false);
    }
  }, [search, selectedTags]);

  // Extract all unique tags from notes
  const allTags = Array.from(new Set(
    notes.flatMap(note => 
      note.tags
        .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
        .map(tag => tag.trim().toLowerCase())
    )
  )).sort();

  const handleTagToggle = (tag) => {
    const normalizedTag = tag.trim().toLowerCase();
    setSelectedTags(prev => 
      prev.includes(normalizedTag)
        ? prev.filter(t => t !== normalizedTag)
        : [...prev, normalizedTag]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTags([]);
    setShowCreateForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Search and Tags */}
        <div className="mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {allTags.map((tag, i) => (
              <button
                key={`${tag}-${i}`}
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  selectedTags.includes(tag) 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
          
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
            >
              Clear all filters
            </button>
          )}
        </div>
  
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            My Notes
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{notes.length} notes</span>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                + Add Note
              </button>
            )}
          </div>
        </div>
  
        {/* Status Messages */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span>Loading notes...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
            <p className="text-red-400">{error}</p>
          </div>
        )}
  
        {/* Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreate} className="mb-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Create New Note</h2>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-slate-300 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="relative">
                <textarea
                  placeholder="Write your note here..."
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  className="w-full p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-slate-400 resize-none transition-all duration-200"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                />
              </div>
              
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </span>
                ) : (
                  'Add Note'
                )}
              </button>
            </div>
          </form>
        )}
  
        {/* Notes List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {!loading && notes.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-slate-500 mb-4">
                <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-xl font-medium text-slate-400">
                  {selectedTags.length > 0 || search 
                    ? "No notes match your filters" 
                    : "No notes found. Create your first note!"}
                </p>
              </div>
            </div>
          ) : (
            notes.map(note => (
              <div
                key={note._id}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
                >
                <NoteCard
                  note={note}
                  onDelete={handleDelete}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}