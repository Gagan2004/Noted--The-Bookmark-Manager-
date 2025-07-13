import { useState } from 'react';
import { ExternalLink, Star, Trash2, Copy, Check } from 'lucide-react';

export default function BookmarkCard({ bookmark, onDelete, onToggleFavorite }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(bookmark._id);
    setIsDeleting(false);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/80 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
      {/* Favorite indicator */}
      {bookmark.favorite && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
          <Star className="w-3 h-3 text-slate-900 fill-current" />
        </div>
      )}

      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <a 
              href={bookmark.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group/link inline-flex items-center gap-2 text-lg font-semibold text-slate-100 hover:text-blue-400 transition-colors duration-200 line-clamp-2"
            >
              <span className="truncate">{bookmark.title || getDomainFromUrl(bookmark.url)}</span>
              <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
            </a>
            <p className="text-slate-400 text-sm mt-1 font-medium">{getDomainFromUrl(bookmark.url)}</p>
          </div>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.slice(0, 4).map((tag, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30 hover:bg-slate-600/50 hover:border-slate-500/50 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
            {bookmark.tags.length > 4 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/30 text-slate-400 border border-slate-600/20">
                +{bookmark.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(bookmark._id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                bookmark.favorite
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                  : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10'
              }`}
            >
              <Star className={`w-4 h-4 ${bookmark.favorite ? 'fill-current' : ''}`} />
              {bookmark.favorite ? 'Favorited' : 'Favorite'}
            </button>
            
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}