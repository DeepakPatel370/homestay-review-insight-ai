import React, { useState } from 'react'
import { useToast } from '../components/ui/Toast'
import { Loader } from '../components/ui/Loader'
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Smile, 
  Frown, 
  Meh, 
  Tag, 
  FileText, 
  Sliders, 
  Save, 
  Bot 
} from 'lucide-react'

export default function AIFeature() {
  const { show } = useToast()

  const [propertyName, setPropertyName] = useState('Sunset Haven Villa')
  const [reviewText, setReviewText] = useState(
    'The villa was absolutely stunning! Clean pools, great layout. Only issue was check-in instructions were outdated and we had to wait 30 minutes outside.'
  )
  const [tone, setTone] = useState('Professional')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  // Preset sample reviews for quick testing
  const sampleReviews = [
    {
      title: '🌟 Positive Review',
      property: 'Sunset Haven Villa',
      tone: 'Enthusiastic',
      text: 'We had the most wonderful stay! The host left us fresh cookies, the house was immaculate, and the beds were so comfy. 10/10 will come back!'
    },
    {
      title: '⚖️ Mixed Review',
      property: 'Sunset Haven Villa',
      tone: 'Professional',
      text: 'The villa was absolutely stunning! Clean pools, great layout. Only issue was check-in instructions were outdated and we had to wait 30 minutes outside.'
    },
    {
      title: '⚠️ Negative Review',
      property: 'Sunset Haven Villa',
      tone: 'Empathetic',
      text: 'Worst experience ever. The sheets were dirty, the air conditioning was leaking, and the host refused to refund us. Avoid!'
    }
  ]

  const handlePresetSelect = (preset) => {
    setPropertyName(preset.property)
    setReviewText(preset.text)
    setTone(preset.tone)
    setErrorMsg(null)
  }

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault()
    
    if (!propertyName.trim()) {
      show('Please enter a property name.', 'error')
      return
    }

    if (!reviewText.trim() || reviewText.trim().length < 10) {
      show('Review text must be at least 10 characters long.', 'error')
      return
    }

    setLoading(true)
    setErrorMsg(null)
    setResult(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const token = localStorage.getItem('token') || localStorage.getItem('insightstay_token')
      const response = await fetch(`${API_URL}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          propertyName: propertyName.trim(),
          text: reviewText.trim(),
          tone
        })
      })

      const json = await response.json()

      if (!response.ok || !json.success) {
        throw new Error(json.message || json.error || 'Failed to process AI request.')
      }

      setResult(json.data)
      show('AI analysis and draft response generated successfully!', 'success')
    } catch (err) {
      console.error('AI Request Failed:', err)
      setErrorMsg(err.message || 'Server network error. Please try again.')
      show(err.message || 'AI analysis failed. Please check network connection.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Helper to force simulate an API Error (for testing error state requirement)
  const handleSimulateError = () => {
    setLoading(true)
    setErrorMsg(null)
    setResult(null)

    setTimeout(() => {
      setLoading(false)
      const errMessage = 'API Rate Limit Exceeded (429): Google Gemini quota reached. Please wait 60 seconds.'
      setErrorMsg(errMessage)
      show(errMessage, 'error')
    }, 1200)
  }

  const handleCopyDraft = () => {
    if (!result?.reply) return
    navigator.clipboard.writeText(result.reply)
    setCopied(true)
    show('Draft response copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSaveToReviews = async () => {
    if (!result) return
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('insightstay_token')
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          propertyName: result.propertyName,
          text: reviewText
        })
      })
      if (res.ok) {
        show('Saved review & AI response to your Review Dashboard history!', 'success')
      } else {
        show('Failed to save to review history.', 'error')
      }
    } catch (err) {
      show('Error saving to dashboard database.', 'error')
    }
  }

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <Smile className="w-5 h-5 text-emerald-500" />
    if (sentiment === 'mixed') return <Meh className="w-5 h-5 text-amber-500" />
    return <Frown className="w-5 h-5 text-rose-500" />
  }

  const getSentimentBadgeClass = (sentiment) => {
    if (sentiment === 'positive') return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
    if (sentiment === 'mixed') return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
    return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Hospitality Suite • Week 7 Feature</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Review Insights & Host Response Generator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analyze guest feedback in seconds with Google Gemini AI. Extract sentiments, rating scores, key themes, and tone-tailored draft replies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateError}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Test Error State</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Input Presets */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Quick Load Sample Reviews:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sampleReviews.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetSelect(preset)}
                className="flex flex-col text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-all cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                  {preset.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                  "{preset.text}"
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Input */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <form onSubmit={handleAnalyze} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <span>Review Input Form</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">POST /api/ai/analyze</span>
              </div>

              {/* Property Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Property Custom Name
                </label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Sunset Haven Villa"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  required
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Paste Guest Review Message
                </label>
                <textarea
                  rows={5}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Paste or write full guest review here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all leading-relaxed"
                  required
                />
              </div>

              {/* Response Tone Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Target Response Tone</span>
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
                >
                  <option value="Professional">👔 Professional & Polite</option>
                  <option value="Empathetic">❤️ Empathetic & Caring</option>
                  <option value="Enthusiastic">🎉 Enthusiastic & Warm</option>
                  <option value="De-escalating">🛡️ De-escalating & Formal</option>
                </select>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size="sm" className="border-white" />
                    <span>Analyzing Review with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze & Generate Host Reply</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: AI Output Display / Loading / Error */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-sky-500" />
                <span>AI Generated Output Preview</span>
              </h2>
              {result && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {result.provider || 'Gemini 1.5 Flash'}
                </span>
              )}
            </div>

            {/* State 1: MID-REQUEST LOADING STATE */}
            {loading && (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
                <Loader size="lg" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Processing Guest Review...
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                    Calling Google Gemini AI service. Extracting sentiment ratings, key themes, and drafting response.
                  </p>
                </div>
              </div>
            )}

            {/* State 2: ERROR STATE */}
            {errorMsg && !loading && (
              <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold">AI Processing Failed</h3>
                    <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                      {errorMsg}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Request</span>
                </button>
              </div>
            )}

            {/* State 3: EMPTY INITIAL STATE */}
            {!loading && !result && !errorMsg && (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Sparkles className="w-10 h-10 stroke-1 text-slate-300 dark:text-slate-700" />
                <p className="text-xs max-w-xs">
                  Fill out the form on the left or select a sample review to run the AI analysis pipeline.
                </p>
              </div>
            )}

            {/* State 4: SUCCESSFUL AI OUTPUT DISPLAY */}
            {result && !loading && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Sentiment & Rating Score Card */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Detected Sentiment
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${getSentimentBadgeClass(result.sentiment)}`}>
                        {getSentimentIcon(result.sentiment)}
                        <span>{result.sentiment}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Satisfaction Rating
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {result.score}<span className="text-xs text-slate-400 font-normal">/100</span>
                      </span>
                      <span className="text-xs text-amber-500 font-bold">
                        ★ {(1.0 + (result.score / 100) * 4.0).toFixed(1)} / 5.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detected Themes */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-sky-500" />
                    <span>Extracted Review Themes</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.themes?.map((theme, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                      >
                        #{theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Summary */}
                {result.summary && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      AI Executive Summary
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-100/70 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                      "{result.summary}"
                    </p>
                  </div>
                )}

                {/* Suggested Host Response Draft */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      <span>Suggested Host Reply ({result.toneUsed} Tone)</span>
                    </span>
                  </div>

                  <div className="relative group">
                    <textarea
                      readOnly
                      rows={6}
                      value={result.reply}
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-sans text-xs leading-relaxed focus:outline-none resize-none shadow-inner"
                    />
                    <button
                      onClick={handleCopyDraft}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveToReviews}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4 text-emerald-500" />
                    <span>Save to Review Dashboard</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
