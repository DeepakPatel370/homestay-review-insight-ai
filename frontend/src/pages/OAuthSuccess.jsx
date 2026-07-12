import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast, Loader } from '../components/ui'
import { Sparkles } from 'lucide-react'

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { token, logout } = useAuth()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      // Save token directly into localStorage (the AuthProvider reads it)
      localStorage.setItem('token', tokenParam)
      
      // We will reload window slightly or just navigate so AuthProvider picks it up
      toast.show('Signed in with Google successfully!', 'success')
      
      setTimeout(() => {
        // Redirect to dashboard
        window.location.href = '/dashboard'
      }, 1000)
    } else {
      toast.show('Authentication failed. No token received.', 'error')
      logout()
      navigate('/login')
    }
  }, [searchParams, navigate, toast, logout])

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center items-center px-4">
      {/* Background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="bg-gradient-brand p-2 rounded-xl text-white">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-display font-bold text-xl text-slate-900 dark:text-white">InsightStay</span>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Authenticating</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">Completing Google authentication flow...</p>
        
        <div className="flex justify-center">
          <Loader className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
      </div>
    </div>
  )
}
