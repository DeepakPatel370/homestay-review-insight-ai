import React, { useState, useEffect } from 'react'
import { Sparkles, MessageSquare, ShieldAlert, Award, Copy, Check, ThumbsUp, RefreshCw, Info, Star, Trash2 } from 'lucide-react'
import { Button, Input, Modal, Loader, useToast } from '../components/ui'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Child Component for each review history item
function ReviewHistoryItem({ review, onDelete, onUpdate, onSelect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState(review.reply);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = async () => {
    await onUpdate(review.id, editedReply);
    setIsEditing(false);
  };

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/20 hover:border-slate-300 dark:hover:border-white/10 transition-all text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-sm text-slate-800 dark:text-white">{review.propertyName}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
            review.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            review.sentiment === 'mixed' ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {review.sentiment} ({review.score}%)
          </span>
          {review.themes.map((t, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 text-[10px]">
              {t}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-gray-500">
          {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 mb-3 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-lg border border-slate-100 dark:border-white/5 italic">
        "{review.text}"
      </p>

      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
        >
          {isExpanded ? 'Hide Draft Response' : 'View Draft Response'}
        </button>
        <span className="text-slate-300 dark:text-gray-700">|</span>
        <button
          onClick={onSelect}
          className="font-semibold text-slate-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
        >
          Load in Editor
        </button>
        <span className="text-slate-300 dark:text-gray-700">|</span>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this review report from history?')) {
              onDelete(review.id);
            }
          }}
          className="font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
        >
          Delete
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-white/5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-gray-500">Suggested Draft</span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                Edit Draft
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedReply(review.reply);
                  }}
                  className="text-[10px] font-semibold text-slate-500 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <p className="text-xs font-mono text-slate-700 dark:text-gray-300 whitespace-pre-line leading-relaxed selection:bg-sky-500/20 select-text">
              {review.reply}
            </p>
          ) : (
            <textarea
              value={editedReply}
              onChange={(e) => setEditedReply(e.target.value)}
              className="w-full min-h-[120px] text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-slate-800 dark:text-gray-200 focus:outline-none focus:border-sky-500/50"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [copied, setCopied] = useState(false)
  const [reviewInput, setReviewInput] = useState('')
  const [propertyName, setPropertyName] = useState('Sunset Haven Villa')
  const [propertyError, setPropertyError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  // API Driven States
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    totalReviews: '0',
    avgRating: '0.0',
    sentimentIndex: '0%',
    aiResponses: '0'
  })
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState('')
  
  const toast = useToast()

  const sampleReviews = [
    {
      label: 'Positive Review',
      text: 'We had the most wonderful stay! The host left us fresh cookies, the house was immaculate, and the beds were so comfy. 10/10 will come back!',
      sentiment: 'positive',
      score: 98,
      themes: ['Hospitality', 'Cleanliness', 'Comfort']
    },
    {
      label: 'Mixed Review',
      text: 'The villa was absolutely stunning! Clean pools, great layout. Only issue was check-in instructions were outdated and we had to wait 30 minutes outside.',
      sentiment: 'mixed',
      score: 55,
      themes: ['Amenities', 'Check-in Delay', 'Villa Quality']
    },
    {
      label: 'Negative Review',
      text: 'Worst experience ever. The sheets were dirty, the air conditioning was leaking, and the host refused to refund us. Avoid!',
      sentiment: 'negative',
      score: 12,
      themes: ['Cleanliness', 'AC Issue', 'Refund Dispute']
    }
  ]

  // Fetch reviews history from backend
  const fetchReviews = async (search = '', sentiment = '') => {
    try {
      let url = `${API_BASE}/reviews`;
      const params = [];
      if (search) params.push(`q=${encodeURIComponent(search)}`);
      if (sentiment) params.push(`sentiment=${encodeURIComponent(sentiment)}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load reviews history.');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
      toast.show(err.message || 'Error fetching review history', 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch dashboard stats from backend
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews/stats`);
      if (!res.ok) throw new Error('Failed to load statistics.');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load on component mount
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  const selectSample = (sample) => {
    setReviewInput(sample.text)
    setAnalysisResult(null)
  }

  // Handle Review Analysis via POST endpoint
  const handleAnalyze = async (e) => {
    e.preventDefault()

    if (!propertyName.trim()) {
      setPropertyError('Property name is required to personalize the AI draft.')
      toast.show('Please enter a property name.', 'error')
      return
    } else {
      setPropertyError('')
    }

    if (!reviewInput.trim()) {
      toast.show('Please paste or select a review to analyze.', 'error')
      return
    }

    setAnalyzing(true)
    setAnalysisResult(null)

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyName, text: reviewInput })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Analysis failed.');
      }

      const newReview = await res.json();
      setAnalysisResult(newReview);
      
      // Refresh backend datasets
      await fetchReviews(searchQuery, sentimentFilter);
      await fetchStats();

      toast.show('AI response generated!', 'success')
    } catch (err) {
      console.error(err);
      toast.show(err.message || 'Failed to analyze review', 'error');
    } finally {
      setAnalyzing(false)
    }
  }

  // Handle Review Sync via POST endpoint
  const handleSync = async () => {
    toast.show('Syncing review channels...', 'info')
    
    try {
      const res = await fetch(`${API_BASE}/reviews/sync`, { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed.');
      
      const data = await res.json();
      
      // Refresh lists & statistics
      await fetchReviews(searchQuery, sentimentFilter);
      await fetchStats();

      toast.show(data.message || 'Reviews synced successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast.show('Failed to sync reviews.', 'error');
    }
  }

  // Handle Review Deletion via DELETE endpoint
  const handleDeleteReview = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review report.');
      
      // If deleted item is currently viewed in draft result, clear it
      if (analysisResult && analysisResult.id === id) {
        setAnalysisResult(null);
      }

      await fetchReviews(searchQuery, sentimentFilter);
      await fetchStats();
      
      toast.show('Review deleted from history!', 'success');
    } catch (err) {
      console.error(err);
      toast.show(err.message || 'Failed to delete review', 'error');
    }
  };

  // Handle Update Response Reply via PUT endpoint
  const handleUpdateReply = async (id, updatedReply) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: updatedReply })
      });

      if (!res.ok) throw new Error('Failed to update response draft.');

      const updated = await res.json();
      
      // Update analysis result if viewed
      if (analysisResult && analysisResult.id === id) {
        setAnalysisResult(updated);
      }

      await fetchReviews(searchQuery, sentimentFilter);
      toast.show('Response draft updated!', 'success');
    } catch (err) {
      console.error(err);
      toast.show(err.message || 'Failed to update response', 'error');
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return
    navigator.clipboard.writeText(analysisResult.reply)
    setCopied(true)
    toast.show('Copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleHelpful = () => {
    toast.show('Feedback submitted. Thanks!', 'success')
  }

  // Stats definition driven by real state
  const metrics = [
    { label: 'Total Reviews', value: stats.totalReviews, change: 'Live Synced', color: 'text-sky-600 dark:text-sky-400' },
    { label: 'Avg. Rating', value: stats.avgRating, change: 'Out of 5.0', color: 'text-amber-500 dark:text-amber-400', isStar: true },
    { label: 'Sentiment Index', value: stats.sentimentIndex, change: 'Positive/Mixed', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'AI Responses Generated', value: stats.aiResponses, change: 'Templates Saved', color: 'text-purple-600 dark:text-purple-400' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Review Insight Dashboard</h1>
          <p className="text-slate-600 dark:text-gray-400 font-light text-sm">Analyze review messages, generate replies, and track overall guest satisfaction.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center justify-center gap-2 flex-grow sm:flex-grow-0"
          >
            <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>AI Guide</span>
          </Button>

          <Button 
            variant="secondary" 
            onClick={handleSync}
            className="flex items-center justify-center gap-2 flex-grow sm:flex-grow-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Reviews</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 flex flex-col justify-between text-left">
            <span className="text-xs text-slate-500 dark:text-gray-500 font-semibold uppercase tracking-wider">{stat.label}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</span>
              {stat.isStar && <Star className="w-5 h-5 fill-amber-500 stroke-amber-500 text-amber-500 dark:fill-amber-400 dark:stroke-amber-400 dark:text-amber-400 self-center" />}
            </div>
            <span className="text-[10px] text-slate-600 dark:text-gray-400 font-semibold mt-1">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Input Workspace */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-white/10">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-left">
              <MessageSquare className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>Input Review Message</span>
            </h2>

            {/* Quick Sample Selector */}
            <div className="mb-4 text-left">
              <label className="block text-xs text-slate-500 dark:text-gray-500 mb-2 uppercase font-semibold">Select Sample Review to Test</label>
              <div className="flex flex-wrap gap-2">
                {sampleReviews.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSample(sample)}
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/5 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-all active:scale-95 cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAnalyze} className="space-y-4">
              <Input
                label="Property Name"
                placeholder="e.g. Sunset Haven Villa"
                value={propertyName}
                error={propertyError}
                onChange={(e) => {
                  setPropertyName(e.target.value)
                  if (propertyError) setPropertyError('')
                }}
              />

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">Review Text</label>
                <textarea
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="Paste Airbnb, Booking.com, or VRBO reviews here to analyze sentiment and generate professional response templates..."
                  className="w-full min-h-[160px] bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm text-slate-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500/50 dark:focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all font-light leading-relaxed resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={analyzing || !reviewInput.trim()}
                className="w-full py-3.5 flex items-center justify-center gap-2 font-semibold"
              >
                {analyzing ? (
                  <>
                    <Loader type="spinner" size="sm" className="mr-1" />
                    <span>Analyzing Reviews...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze & Generate Reply</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Output Workspace */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {analyzing ? (
            <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-white/10 flex flex-col h-full min-h-[350px] justify-center text-left">
              <h3 className="font-display font-semibold text-slate-950 dark:text-white mb-4 text-sm">Generating AI Insights...</h3>
              <Loader type="skeleton" rows={5} />
            </div>
          ) : analysisResult ? (
            <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-white/10 flex flex-col justify-between h-full animate-in fade-in duration-300 text-left">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>AI Analysis Results</span>
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </h2>

                {/* Sentiment & Score */}
                <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-gray-500 uppercase font-semibold">Detected Sentiment</div>
                    <div className={`text-lg font-bold capitalize mt-0.5 ${
                      analysisResult.sentiment === 'positive' ? 'text-emerald-600 dark:text-emerald-400' :
                      analysisResult.sentiment === 'mixed' ? 'text-amber-500 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {analysisResult.sentiment}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-gray-500 uppercase font-semibold">Confidence Score</div>
                    <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">{analysisResult.score}%</div>
                  </div>
                </div>

                {/* Key Themes */}
                <div className="mb-6">
                  <div className="text-xs text-slate-500 dark:text-gray-500 uppercase font-semibold mb-2">Detected Themes</div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.themes.map((theme, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/15 font-semibold"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Reply Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-slate-500 dark:text-gray-500 uppercase font-semibold">Suggested Response Draft</label>
                    <button
                      onClick={handleCopy}
                      type="button"
                      className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors bg-sky-500/5 hover:bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-500/10 font-semibold cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs font-mono text-slate-800 dark:text-gray-300 leading-relaxed min-h-[160px] whitespace-pre-line select-text">
                    {analysisResult.reply}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handleHelpful} 
                  className="w-full flex items-center justify-center gap-2 py-2"
                >
                  <ThumbsUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Helpful Draft</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[350px]">
              <div className="bg-sky-500/5 p-4 rounded-full border border-sky-500/10 text-sky-600 dark:text-sky-400 mb-4 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg mb-2">No Analysis Yet</h3>
              <p className="text-slate-500 dark:text-gray-500 font-light text-sm max-w-xs leading-relaxed">
                Enter your property name, choose a sample review on the left, then click analyze to generate your review response.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Analyses History Section (Full CRUD View) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-left animate-in fade-in duration-300 mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-200 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>Recent Analyses History</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-500 font-light mt-1">Manage and edit your historical review reports and AI drafts.</p>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchReviews(e.target.value, sentimentFilter);
              }}
              className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500/30 transition-all"
            />
            <select
              value={sentimentFilter}
              onChange={(e) => {
                setSentimentFilter(e.target.value);
                fetchReviews(searchQuery, e.target.value);
              }}
              className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-gray-200 focus:outline-none focus:border-sky-500/30 transition-all cursor-pointer"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="mixed">Mixed</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        {loadingHistory ? (
          <div className="py-12 flex justify-center">
            <Loader type="spinner" size="lg" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-gray-500 text-sm font-light">
            No history records found. Try analyzing a review or syncing!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <ReviewHistoryItem
                key={rev.id}
                review={rev}
                onDelete={handleDeleteReview}
                onUpdate={handleUpdateReply}
                onSelect={() => {
                  setReviewInput(rev.text);
                  setPropertyName(rev.propertyName);
                  setAnalysisResult(rev);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                  toast.show('Review loaded into editor!', 'info');
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Guide/Help Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="AI Response Best Practices Guide"
      >
        <div className="space-y-4 text-left text-slate-700 dark:text-gray-300">
          <p className="text-sm leading-relaxed">
            Writing responses to guest reviews is key to maintaining a high reputation. Here is how InsightStay AI helps you write professional replies:
          </p>
          
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
              <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">01. Appreciate Positive Highlights</h4>
              <p className="text-xs text-slate-600 dark:text-emerald-300/85 leading-relaxed font-light">
                Celebrate key achievements mentioned by guests, such as comfort, cleanliness, and special amenities.
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-500/20 rounded-xl">
              <h4 className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">02. Address Mixed Experiences</h4>
              <p className="text-xs text-slate-600 dark:text-amber-300/85 leading-relaxed font-light">
                Apologize genuinely for specific delay or communication friction. Explain steps taken to resolve them.
              </p>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-500/20 rounded-xl">
              <h4 className="text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider mb-1">03. Resolve Negative Claims</h4>
              <p className="text-xs text-slate-600 dark:text-rose-300/85 leading-relaxed font-light">
                Take issues seriously, express deep apologies, offer co-host details or customer relations checkups, and preserve your Superhost score.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={() => setIsHelpOpen(false)}>
              Got it, thanks!
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
