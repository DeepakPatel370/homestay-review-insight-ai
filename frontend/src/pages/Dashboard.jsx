import React, { useState } from 'react'
import { Sparkles, MessageSquare, ShieldAlert, Award, Copy, Check, ThumbsUp, RefreshCw, Send, Star } from 'lucide-react'

export default function Dashboard() {
  const [copied, setCopied] = useState(false)
  const [reviewInput, setReviewInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const sampleReviews = [
    {
      label: 'Positive Review',
      text: 'We had the most wonderful stay! The host left us fresh cookies, the house was immaculate, and the beds were so comfy. 10/10 will come back!',
      sentiment: 'positive',
      score: 98,
      themes: ['Hospitality', 'Cleanliness', 'Comfort'],
      reply: 'Hi Guest,\n\nThank you so much for your glowing review! We are absolutely thrilled to hear you enjoyed the cookies and found the beds comfortable. Maintaining an immaculate home and providing top-notch hospitality is our priority. We look forward to welcoming you back for another 10/10 stay!\n\nBest regards,\nManagement Team'
    },
    {
      label: 'Mixed Review',
      text: 'The villa was absolutely stunning! Clean pools, great layout. Only issue was check-in instructions were outdated and we had to wait 30 minutes outside.',
      sentiment: 'mixed',
      score: 55,
      themes: ['Amenities', 'Check-in Delay', 'Villa Quality'],
      reply: 'Hi Guest,\n\nThank you for sharing your feedback. We are happy that you enjoyed the stunning villa and clean pool! However, we sincerely apologize for the delay during check-in due to the outdated instructions. We have updated our check-in guide immediately to ensure this does not happen again. We hope to host you again for a seamless experience.\n\nWarm regards,\nManagement Team'
    },
    {
      label: 'Negative Review',
      text: 'Worst experience ever. The sheets were dirty, the air conditioning was leaking, and the host refused to refund us. Avoid!',
      sentiment: 'negative',
      score: 12,
      themes: ['Cleanliness', 'AC Issue', 'Refund Dispute'],
      reply: 'Hi Guest,\n\nWe are deeply sorry to hear about your experience. Cleanliness and functional amenities are critical to us, and we apologize that the sheets and air conditioning fell short. We take these matters seriously and are addressing them with our maintenance staff. Regarding your refund request, our management is reviewing the logs to resolve this fairly. We appreciate your feedback.\n\nSincerely,\nCustomer Relations'
    }
  ]

  const selectSample = (sample) => {
    setReviewInput(sample.text)
    setAnalysisResult(null)
  }

  const handleAnalyze = (e) => {
    e.preventDefault()
    if (!reviewInput.trim()) return

    setAnalyzing(true)
    // Simulate API delay
    setTimeout(() => {
      // Find matches in sample reviews or generate default template
      const matched = sampleReviews.find(r => r.text === reviewInput) || {
        sentiment: 'positive',
        score: 85,
        themes: ['Guest Feedback', 'General Stay'],
        reply: `Hi Guest,\n\nThank you for taking the time to share your feedback. We appreciate your thoughts and will use them to continuously improve our services.\n\nBest regards,\nManagement Team`
      }
      setAnalysisResult(matched)
      setAnalyzing(false)
    }, 1200)
  }

  const handleCopy = () => {
    if (!analysisResult) return
    navigator.clipboard.writeText(analysisResult.reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Dashboard Stats
  const stats = [
    { label: 'Total Reviews', value: '148', change: '+12% vs last month', color: 'text-sky-400' },
    { label: 'Avg. Rating', value: '4.8', change: 'Outstanding', color: 'text-amber-400', isStar: true },
    { label: 'Sentiment Index', value: '92%', change: 'Mostly Positive', color: 'text-emerald-400' },
    { label: 'AI Responses Generated', value: '112', change: '100% response rate', color: 'text-purple-400' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">Review Insight Dashboard</h1>
          <p className="text-gray-400 font-light text-sm">Analyze review messages, generate replies, and track overall guest satisfaction.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/5 transition-all">
            <RefreshCw className="w-4 h-4" />
            <span>Sync Reviews</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</span>
              {stat.isStar && <Star className="w-5 h-5 fill-amber-400 stroke-amber-400 text-amber-400 self-center" />}
            </div>
            <span className="text-[10px] text-gray-400 font-light mt-1">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Workspace */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              <span>Input Review Message</span>
            </h2>

            {/* Quick Sample Selector */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-2 uppercase font-medium">Select Sample Review to Test</label>
              <div className="flex flex-wrap gap-2">
                {sampleReviews.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSample(sample)}
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/40 hover:bg-slate-800 text-gray-300 border border-white/5 hover:border-sky-500/30 transition-all active:scale-95"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <textarea
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="Paste Airbnb, Booking.com, or VRBO reviews here to analyze sentiment and generate professional response templates..."
                  className="w-full min-h-[160px] bg-slate-950/50 border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all font-light leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={analyzing || !reviewInput.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-brand disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing Reviews...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze & Generate Reply</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Output Workspace */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {analysisResult ? (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between h-full animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold font-display text-white mb-4 flex items-center justify-between">
                  <span>AI Analysis Results</span>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </h2>

                {/* Sentiment & Score */}
                <div className="mb-6 p-4 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Detected Sentiment</div>
                    <div className={`text-lg font-bold capitalize mt-0.5 ${
                      analysisResult.sentiment === 'positive' ? 'text-emerald-400' :
                      analysisResult.sentiment === 'mixed' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {analysisResult.sentiment}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase font-semibold">Confidence Score</div>
                    <div className="text-2xl font-bold font-display text-white">{analysisResult.score}%</div>
                  </div>
                </div>

                {/* Key Themes */}
                <div className="mb-6">
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Detected Themes</div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.themes.map((theme, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs bg-sky-500/10 text-sky-400 border border-sky-500/15"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Reply Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500 uppercase font-semibold">Suggested Response Draft</label>
                    <button
                      onClick={handleCopy}
                      type="button"
                      className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/5 hover:bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/10"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="w-full bg-slate-950/60 border border-white/5 rounded-xl p-4 text-xs font-mono text-gray-300 leading-relaxed min-h-[160px] whitespace-pre-line select-text">
                    {analysisResult.reply}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                <button className="flex-grow flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-sm font-medium border border-white/5 transition-all">
                  <ThumbsUp className="w-4 h-4 text-sky-400" />
                  <span>Helpful Draft</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[350px]">
              <div className="bg-sky-500/5 p-4 rounded-full border border-sky-500/10 text-sky-400 mb-4">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">No Analysis Yet</h3>
              <p className="text-gray-500 font-light text-sm max-w-xs">
                Paste a review message or select a sample on the left, then click analyze to generate your review response.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
