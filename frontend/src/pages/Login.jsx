import React, { useState } from 'react'
import { LogIn, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, useToast } from '../components/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Simple mock validation
    let valid = true
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address.')
      valid = false
    } else {
      setEmailError('')
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      valid = false
    } else {
      setPasswordError('')
    }

    if (!valid) {
      toast.show('Please fix the errors in the form.', 'error')
      return
    }

    setLoading(true)
    // Simulate API authorization request
    setTimeout(() => {
      setLoading(false)
      toast.show('Logged in successfully!', 'success')
      navigate('/dashboard')
    }, 1000)
  }

  const handleMockGoogleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.show('Connected with Google!', 'success')
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      {/* Background ambient radial lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="bg-gradient-brand p-1.5 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-base text-slate-900 dark:text-white">InsightStay</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-gray-400 text-xs font-light">Sign in to manage reviews and generate response sheets.</p>
        </div>

        {/* OAuth Mock Button */}
        <Button
          variant="secondary"
          disabled={loading}
          onClick={handleMockGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-3 mb-6 font-semibold"
        >
          {/* Simple Mock Google Icon */}
          <svg className="w-4 h-4 mr-1 text-slate-700 dark:text-slate-200" viewBox="0 0 24 24">
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
          <span className="text-slate-800 dark:text-slate-200">Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-slate-200 dark:bg-white/5 flex-grow"></div>
          <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-semibold">or email login</span>
          <div className="h-px bg-slate-200 dark:bg-white/5 flex-grow"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-[38px] w-4 h-4 text-slate-400 dark:text-gray-600 z-10" />
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
              }}
              placeholder="you@example.com"
              className="pl-0"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-[38px] w-4 h-4 text-slate-400 dark:text-gray-600 z-10" />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              error={passwordError}
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) setPasswordError('')
              }}
              placeholder="••••••••"
              className="pl-0"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] mt-1 px-1">
            <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline">Forgot password?</a>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-6"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-[11px] text-slate-500 dark:text-gray-500 mt-6 text-center">
          Don't have an account? <a href="#" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">Register</a>
        </p>
      </div>
    </div>
  )
}
