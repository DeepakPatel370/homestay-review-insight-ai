import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, MessageSquare, ShieldCheck, Heart } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pb-28">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] -z-10 animate-pulse duration-5000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Gemini AI</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Transform Guest Reviews into{' '}
          <span className="bg-gradient-text">Actionable Insights</span>
        </h1>

        {/* Subheadline */}
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Analyze homestay feedback, track guest sentiment, and auto-generate professional responses instantly. Drive higher ratings and bookings.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-gradient-brand hover:opacity-95 text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            <span>Analyze Your Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            to="/about"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-gray-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 hover:border-white/10 hover:scale-105 active:scale-95 transition-all"
          >
            Learn More
          </Link>
        </div>

        {/* CSS Mockup Representation */}
        <div className="relative mx-auto max-w-4xl glass-card rounded-2xl p-2.5 sm:p-4 shadow-2xl border border-white/10">
          <div className="rounded-xl overflow-hidden bg-slate-950/80 border border-white/5">
            {/* Mockup Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-mono tracking-wider">
                APP.INSIGHTSTAY.COM/ANALYTICS
              </div>
              <div className="w-12"></div>
            </div>

            {/* Mockup Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-left">
              {/* Left Widget: Input Review */}
              <div className="md:col-span-2 bg-slate-900/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Guest Review Input</span>
                  </div>
                  <p className="text-xs text-gray-400 italic font-light leading-relaxed">
                    "The homestay was clean and the view was incredible! However, the host took a long time to respond to our checkout queries and the hot water wasn't working in the morning."
                  </p>
                </div>
                <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">Source: Airbnb • Guest: Alex M.</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Mixed Review</span>
                </div>
              </div>

              {/* Right Widget: Analysis Result */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">AI Analysis</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  
                  {/* Sentiment Bar */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Sentiment Score</span>
                        <span className="text-emerald-400 font-medium">68% Positive</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>

                    {/* Detected Topics */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-500">Key Themes</div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-[9px]">Cleanliness</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-[9px]">View</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/10 text-[9px]">Hot Water</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/10 text-[9px]">Communication</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-right">
                  <span className="text-[10px] font-semibold text-sky-400 hover:underline cursor-pointer flex items-center justify-end gap-1">
                    <span>Generate Response</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
