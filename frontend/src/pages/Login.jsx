import React, { useState } from 'react'
import { LogIn, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API authorization request
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      {/* Background ambient radial lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="bg-gradient-brand p-1.5 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-base text-white">InsightStay</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-xs font-light">Sign in to manage reviews and generate response sheets.</p>
        </div>

        {/* OAuth Mock Button */}
        <button
          type="button"
          onClick={() => {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              navigate('/dashboard')
            }, 800)
          }}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-gray-200 border border-white/5 py-3 rounded-xl text-sm font-semibold transition-all mb-6 active:scale-[0.99]"
        >
          {/* Simple Mock Google Icon */}
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-white/5 flex-grow"></div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">or email login</span>
          <div className="h-px bg-white/5 flex-grow"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950/40 border border-white/5 hover:border-white/10 focus:border-sky-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1 text-left">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Password</label>
              <a href="#" className="text-[10px] text-sky-400 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/40 border border-white/5 hover:border-white/10 focus:border-sky-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-brand text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-6"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-[11px] text-gray-500 mt-6 text-center">
          Don't have an account? <a href="#" className="text-sky-400 font-semibold hover:underline">Register</a>
        </p>
      </div>
    </div>
  )
}
