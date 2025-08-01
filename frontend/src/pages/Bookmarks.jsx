import { useEffect, useState } from 'react';
import axios from 'axios';
import BookmarkCard from '../components/BookmarkCard';
import debounce from 'lodash.debounce';

// NEW: Helper function to generate a summary from a URL
const getSummary = async (url) => {
  if (!url) return '';
  try {
    const targetUrl = encodeURIComponent(url);
    const res = await fetch(`https://r.jina.ai/http://${targetUrl}`);
    if (!res.ok) throw new Error('API request to Jina AI failed');
    const summary = await res.text();
    // Trim summary and return
    return summary.length > 1000 ? summary.substring(0, 1000) + '...' : summary;
  } catch (err) {
    console.error('Failed to get summary:', err);
    return ' API REQUEST FAILED::Summary could not be generated.'; // Return a consistent fallback string
  }
};

// NEW: Helper function to generate a clean title from a URL
const generateTitleFromUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    // Try to get a title from the last part of the URL path
    const pathSegments = url.pathname.split('/').filter(Boolean);
    let potentialTitle = pathSegments.pop() || '';

    if (potentialTitle) {
      // Clean up the segment
      potentialTitle = potentialTitle.replace(/\.(html|htm|php)$/i, '');
      potentialTitle = potentialTitle.replace(/[-_]/g, ' ');
      // Capitalize words
      potentialTitle = potentialTitle
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      if (potentialTitle.trim().length > 2) {
        return potentialTitle;
      }
    }
    
    // Fallback to a cleaned-up hostname
    let hostname = url.hostname.replace(/^www\./, '');
    hostname = hostname.split('.')[0];
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);

  } catch (error) {
    console.error('Invalid URL for title generation:', urlString);
    return 'New Bookmark'; // Fallback for invalid URLs
  }
};


export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [form, setForm] = useState({ url: '', title: '', description: '', tags: '' });
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const token = localStorage.getItem('token');

  const fetchBookmarks = async () => {
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

      const res = await axios.get(`https://noted-the-bookmark-manager.onrender.com/api/bookmarks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookmarks(res.data);
    } catch (err) {
      setError('Failed to fetch bookmarks');
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: handleCreate now performs auto-generation for empty fields
  const handleCreate = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let { url, title, description, tags } = form;

      // Auto-generate title if the field is empty
      if (!title.trim() && url.trim()) {
        title = generateTitleFromUrl(url);
      }

      // Auto-generate description if the field is empty
      if (!description.trim() && url.trim()) {
        description = await getSummary(url);
      }
      
      const payload = {
        url,
        title,
        description,
        tags: tags.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      };

      await axios.post('https://noted-the-bookmark-manager.onrender.com/api/bookmarks', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setForm({ url: '', title: '', description: '', tags: '' });
      await fetchBookmarks(); // Re-fetch bookmarks which will also handle loading state
    
    } catch (err) {
      console.error('Error creating bookmark:', err);
      setError('Failed to create bookmark');
      setLoading(false); // Ensure loading is disabled on error
    }
  };
  
  // UPDATED: This function now uses the new getSummary helper
  const handleGenerateSummary = async () => {
    if (!form.url.trim() || isSummarizing) return;

    setIsSummarizing(true);
    setError(null);
    
    const summary = await getSummary(form.url);
    setForm(prevForm => ({ ...prevForm, description: summary }));
    
    setIsSummarizing(false);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`https://noted-the-bookmark-manager.onrender.com/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookmarks();
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      setError('Failed to delete bookmark');
    }
  };

  const toggleFavorite = async id => {
    try {
      await axios.patch(`https://noted-the-bookmark-manager.onrender.com/api/bookmarks/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookmarks();
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update bookmark');
    }
  };

  useEffect(() => {
    const debounced = debounce(() => fetchBookmarks(), 300);
    debounced();
    return () => debounced.cancel();
  }, [search, selectedTags]);

  useEffect(() => {
    if (search.trim() || selectedTags.length > 0) {
      setShowCreateForm(false);
    }
  }, [search, selectedTags]);

  const allTags = Array.from(new Set(
    bookmarks.flatMap(bookmark => 
      (bookmark.tags || [])
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
    // ...The JSX for the component remains unchanged from the previous version
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
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
              placeholder="Search bookmarks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {allTags.map((tag, i) => (
              <button
                key={`${tag}-${i}`}
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  selectedTags.includes(tag) 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
          
          {(selectedTags.length > 0 || search.trim()) && (
            <button
              onClick={clearFilters}
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            My Bookmarks
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{bookmarks.length} bookmarks</span>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
              >
                + Add Bookmark
              </button>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
              <span>Loading bookmarks...</span>
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
              <h2 className="text-xl font-semibold text-white">Add New Bookmark</h2>
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
                  type="url"
                  placeholder="Bookmark URL"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  className="w-full p-4 pr-36 bg-slate-900/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={!form.url.trim() || isSummarizing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSummarizing ? 'Generating...' : '✨ Generate'}
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <textarea
                  placeholder="Description..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-white placeholder-slate-400 resize-none transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                />
              </div>
              
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </span>
                ) : (
                  'Save Bookmark'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Bookmark List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && bookmarks.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-slate-500 mb-4">
                <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-xl font-medium text-slate-400">
                  {selectedTags.length > 0 || search 
                    ? "No bookmarks match your filters" 
                    : "No bookmarks found. Add your first bookmark!"}
                </p>
              </div>
            </div>
          ) : (
            bookmarks.map(bookmark => (
              <div
                key={bookmark._id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <BookmarkCard
                  bookmark={bookmark}
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