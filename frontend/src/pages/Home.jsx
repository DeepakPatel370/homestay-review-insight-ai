import React from 'react'
import Hero from '../components/Hero'
import Card from '../components/Card'
import { Sparkles, BarChart2, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    {
      title: 'AI Response Generator',
      description: 'Generate professional, customized response templates for guest reviews based on their feedback details automatically.',
      icon: Sparkles,
      tags: ['Gemini AI', 'Automation'],
      actionText: 'Generate Responses',
      actionLink: '/dashboard'
    },
    {
      title: 'Sentiment Tracking',
      description: 'Analyze overall sentiment (positive, neutral, negative) trends over time to identify issues early.',
      icon: BarChart2,
      tags: ['Analytics', 'Real-time'],
      actionText: 'Open Dashboard',
      actionLink: '/dashboard'
    },
    {
      title: 'Reputation Management',
      description: 'Secure and protect your brand score across major platforms like Airbnb, Booking.com, and VRBO.',
      icon: ShieldCheck,
      tags: ['Brand Care', 'Security'],
      actionText: 'Learn Reputation',
      actionLink: '/about'
    },
    {
      title: 'Guest Delight',
      description: 'Listen to guest reviews closely and implement features that directly address common complaints to drive 5-star ratings.',
      icon: Heart,
      tags: ['CRM', 'Optimization'],
      actionText: 'View Case Studies',
      actionLink: '/about'
    }
  ]

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <Hero />

      {/* Features/Stats Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Supercharge Your Homestay Operations
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            Spend less time writing messages and more time improving guest experiences. Let InsightStay handle the analytics.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              tags={feature.tags}
              actionText={feature.actionText}
              actionLink={feature.actionLink}
            />
          ))}
        </div>

        {/* Callout Section */}
        <div className="relative glass-panel rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/10 text-left">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Award className="w-4 h-4" />
                <span>Host Excellence</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to elevate your Superhost status?
              </h3>
              <p className="text-gray-300 font-light leading-relaxed max-w-xl">
                Get started today and see review response time drop from hours to seconds. Join hundreds of property owners currently optimizing with InsightStay.
              </p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <Link
                to="/login"
                className="flex items-center gap-2 bg-white text-slate-950 hover:bg-gray-100 px-6 py-3.5 rounded-xl font-semibold shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
