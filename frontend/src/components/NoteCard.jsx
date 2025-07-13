import { useState } from 'react';
import { Star, Trash2, Copy, Check, Edit3, Clock } from 'lucide-react';

export default function NoteCard({ note, onDelete, onToggleFavorite, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(note._id);
    setIsDeleting(false);
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const truncateContent = (content, maxLength = 200) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const shouldShowExpand = note.content && note.content.length > 200;

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/80 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
      {/* Favorite indicator */}
      {note.favorite && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
          <Star className="w-3 h-3 text-slate-900 fill-current" />
        </div>
      )}

      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-100 line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
              {note.title || 'Untitled Note'}
            </h3>
            {(note.createdAt || note.updatedAt) && (
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {formatDate(note.updatedAt || note.createdAt)}
              </div>
            )}
          </div>
          
          {onEdit && (
            <button
              onClick={() => onEdit(note)}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        {note.content && (
          <div className="relative">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {isExpanded ? note.content : truncateContent(note.content)}
            </p>
            
            {shouldShowExpand && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.slice(0, 5).map((tag, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30 hover:bg-slate-600/50 hover:border-slate-500/50 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 5 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/30 text-slate-400 border border-slate-600/20">
                +{note.tags.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(note._id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                note.favorite
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                  : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10'
              }`}
            >
              <Star className={`w-4 h-4 ${note.favorite ? 'fill-current' : ''}`} />
              {note.favorite ? 'Favorited' : 'Favorite'}
            </button>
            
            {note.content && (
              <button
                onClick={handleCopyContent}
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
            )}
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