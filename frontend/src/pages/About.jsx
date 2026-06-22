import React from 'react'
import { Sparkles, Heart, Compass, BookOpen, ShieldCheck } from 'lucide-react'

export default function About() {
  const steps = [
    {
      step: '01',
      title: 'Aggregate Reviews',
      description: 'Automatically import and collect reviews from major platforms like Airbnb, Vrbo, and Booking.com.'
    },
    {
      step: '02',
      title: 'Analyze Sentiment',
      description: 'Our system scans review text for satisfaction tags, category themes, and positive/negative signals.'
    },
    {
      step: '03',
      title: 'Generate Replies',
      description: 'Using professional context guidelines and Gemini, we draft the perfect reply for your approval.'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-sky-500/10">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Our Story & Vision</span>
        </div>
        <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-6">About InsightStay AI</h1>
        <p className="text-slate-600 dark:text-gray-400 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          We build tools to empower property hosts, property management groups, and hospitality teams to analyze guest reviews and reply professionally with AI.
        </p>
      </div>

      {/* Main Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5 text-left">
          <div className="bg-sky-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-6">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">Our Mission</h2>
          <p className="text-slate-600 dark:text-gray-400 font-light leading-relaxed text-sm">
            To bridge the communication gap between property hosts and guests. By translating scattered reviews into structured analytics, we help owners improve services and achieve higher ratings.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5 text-left">
          <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">Brand Integrity</h2>
          <p className="text-slate-600 dark:text-gray-400 font-light leading-relaxed text-sm">
            We believe that every review is an opportunity. Our drafts match the tone of professional hospitality services, ensuring your brand stays secure even under stressful negative claims.
          </p>
        </div>
      </div>

      {/* Workflow Process */}
      <div className="border-t border-slate-200 dark:border-white/5 pt-16 text-center">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">How It Works</h2>
        <p className="text-slate-600 dark:text-gray-400 font-light max-w-xl mx-auto mb-12 text-sm">
          A seamless flow designed to get reviews imported, parsed, and answered in just a few clicks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {steps.map((item, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 relative">
              <span className="absolute right-6 top-6 text-3xl font-extrabold text-slate-200 dark:text-slate-800/60 font-mono tracking-tighter">
                {item.step}
              </span>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base mb-3 mt-4">
                {item.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 font-light text-xs leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
