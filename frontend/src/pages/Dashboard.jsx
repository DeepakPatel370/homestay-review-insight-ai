import React, { useState } from 'react'
import { Sparkles, MessageSquare, ShieldAlert, Award, Copy, Check, ThumbsUp, RefreshCw, Info, Star } from 'lucide-react'
import { Button, Input, Modal, Loader, useToast } from '../components/ui'

export default function Dashboard() {
  const [copied, setCopied] = useState(false)
  const [reviewInput, setReviewInput] = useState('')
  const [propertyName, setPropertyName] = useState('Sunset Haven Villa')
  const [propertyError, setPropertyError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const toast = useToast()

  const sampleReviews = [
    {
      label: 'Positive Review',
      text: 'We had the most wonderful stay! The host left us fresh cookies, the house was immaculate, and the beds were so comfy. 10/10 will come back!',
      sentiment: 'positive',
      score: 98,
      themes: ['Hospitality', 'Cleanliness', 'Comfort'],
      reply: (prop) => `Hi Guest,\n\nThank you so much for your glowing review! We are absolutely thrilled to hear you enjoyed the cookies and found the beds comfortable. Maintaining an immaculate home and providing top-notch hospitality here at ${prop} is our priority. We look forward to welcoming you back for another 10/10 stay!\n\nBest regards,\n${prop} Team`
    },
    {
      label: 'Mixed Review',
      text: 'The villa was absolutely stunning! Clean pools, great layout. Only issue was check-in instructions were outdated and we had to wait 30 minutes outside.',
      sentiment: 'mixed',
      score: 55,
      themes: ['Amenities', 'Check-in Delay', 'Villa Quality'],
      reply: (prop) => `Hi Guest,\n\nThank you for sharing your feedback. We are happy that you enjoyed the stunning villa and clean pool! However, we sincerely apologize for the delay during check-in due to the outdated instructions. We have updated our check-in guide at ${prop} immediately to ensure this does not happen again. We hope to host you again for a seamless experience.\n\nWarm regards,\n${prop} Team`
    },
    {
      label: 'Negative Review',
      text: 'Worst experience ever. The sheets were dirty, the air conditioning was leaking, and the host refused to refund us. Avoid!',
      sentiment: 'negative',
      score: 12,
      themes: ['Cleanliness', 'AC Issue', 'Refund Dispute'],
      reply: (prop) => `Hi Guest,\n\nWe are deeply sorry to hear about your experience. Cleanliness and functional amenities are critical to us at ${prop}, and we apologize that the sheets and air conditioning fell short. We take these matters seriously and are addressing them with our maintenance staff. Regarding your refund request, our management is reviewing the logs to resolve this fairly. We appreciate your feedback.\n\nSincerely,\nCustomer Relations`
    }
  ]

  const selectSample = (sample) => {
    setReviewInput(sample.text)
    setAnalysisResult(null)
  }

  const handleAnalyze = (e) => {
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

    // Simulate API delay
    setTimeout(() => {
      const matched = sampleReviews.find(r => r.text === reviewInput)
      if (matched) {
        setAnalysisResult({
          ...matched,
          reply: matched.reply(propertyName)
        })
      } else {
        setAnalysisResult({
          sentiment: 'positive',
          score: 85,
          themes: ['Guest Feedback', 'General Stay'],
          reply: `Hi Guest,\n\nThank you for taking the time to share your feedback about your stay at ${propertyName}. We appreciate your thoughts and will use them to continuously improve our services.\n\nBest regards,\n${propertyName} Team`
        })
      }
      setAnalyzing(false)
      toast.show('AI response generated!', 'success')
    }, 1200)
  }

  const handleCopy = () => {
    if (!analysisResult) return
    navigator.clipboard.writeText(analysisResult.reply)
    setCopied(true)
    toast.show('Copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSync = () => {
    toast.show('Syncing review channels...', 'info')
    setTimeout(() => {
      toast.show('Reviews synced from Airbnb & Vrbo!', 'success')
    }, 1500)
  }

  const handleHelpful = () => {
    toast.show('Feedback submitted. Thanks!', 'success')
  }

  // Dashboard Stats
  const stats = [
    { label: 'Total Reviews', value: '148', change: '+12% vs last month', color: 'text-sky-600 dark:text-sky-400' },
    { label: 'Avg. Rating', value: '4.8', change: 'Outstanding', color: 'text-amber-500 dark:text-amber-400', isStar: true },
    { label: 'Sentiment Index', value: '92%', change: 'Mostly Positive', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'AI Responses Generated', value: '112', change: '100% response rate', color: 'text-purple-600 dark:text-purple-400' },
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
        {stats.map((stat, idx) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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

      {/* Guide/Help Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="AI Response Best Practices Guide"
      >
        <div className="space-y-4 text-left">
          <p className="text-sm leading-relaxed">
            Writing responses to guest reviews is key to maintaining a high reputation. Here is how InsightStay AI helps you write professional replies:
          </p>
          
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
              <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">01. Appreciate Positive Highlights</h4>
              <p className="text-xs text-slate-600 dark:text-emerald-300/80 leading-relaxed">
                Celebrate key achievements mentioned by guests, such as comfort, cleanliness, and special amenities.
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-500/20 rounded-xl">
              <h4 className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">02. Address Mixed Experiences</h4>
              <p className="text-xs text-slate-600 dark:text-amber-300/80 leading-relaxed">
                Apologize genuinely for specific delay or communication friction. Explain steps taken to resolve them.
              </p>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-500/20 rounded-xl">
              <h4 className="text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider mb-1">03. Resolve Negative Claims</h4>
              <p className="text-xs text-slate-600 dark:text-rose-300/80 leading-relaxed">
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
